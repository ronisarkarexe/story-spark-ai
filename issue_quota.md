The project has a working subscription model (`subscriptionType` on the User document) and a Razorpay payment flow, but **none of the AI generation endpoints enforce any quota based on the user's tier**. Every user — `free`, `pro`, or otherwise — can call story generation and continuation endpoints unlimited times. This makes the paid plan commercially meaningless.

There are three linked gaps:

1. **No quota enforcement on generation endpoints** — `POST /api/v1/story/generate` and `POST /api/v1/story-continuation/continue` do not check `subscriptionType` before calling the AI. A free user can generate unlimited stories with no restriction.

2. **No usage tracking** — There is no `UsageRecord` or equivalent model persisting `{ userId, action, timestamp, count }` per generation call. Without it, enforcement is architecturally impossible even if a middleware check is added.

3. **No quota-exhausted UI feedback** — The frontend has no code path handling a `429` quota-exceeded response. Adding backend enforcement without the UI layer would silently break users.

---

**Proposed Solution**

**1. New `UsageRecord` model**

```ts
// backend/src/models/usageRecord.model.ts
{
  userId: ObjectId,
  action: "story_generate" | "story_continue",
  billingPeriodStart: Date,  // start of current month
  count: number
}
// Compound unique index: { userId, action, billingPeriodStart }
```

**2. Quota config by plan**

```ts
// backend/src/config/quota.config.ts
export const PLAN_QUOTAS = {
  free:  { story_generate: 5,  story_continue: 3  },
  pro:   { story_generate: 50, story_continue: 30 },
  elite: { story_generate: Infinity, story_continue: Infinity },
};
```

**3. `enforceQuota` middleware** (atomic increment-then-check to avoid race conditions)

```ts
async function enforceQuota(action: QuotaAction) {
  return async (req, res, next) => {
    const user = req.user;
    const limit = PLAN_QUOTAS[user.subscriptionType][action];
    if (limit === Infinity) return next();

    const periodStart = startOfMonth(new Date());
    const record = await UsageRecord.findOneAndUpdate(
      { userId: user._id, action, billingPeriodStart: periodStart },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    if (record.count > limit) {
      await UsageRecord.updateOne(
        { userId: user._id, action, billingPeriodStart: periodStart },
        { $inc: { count: -1 } }
      );
      return res.status(429).json({
        error: "QUOTA_EXCEEDED",
        used: record.count - 1,
        limit,
        plan: user.subscriptionType,
        resetsAt: endOfMonth(new Date()),
      });
    }
    next();
  };
}
```

**4. New `GET /api/v1/usage/me` endpoint** — returns current period usage per action so the frontend can display a live counter.

**5. Frontend quota indicator** — a progress bar on the story generation page showing `3 / 5 stories used this month` and a graceful **"Upgrade to Pro"** modal triggered when `QUOTA_EXCEEDED` is returned.

---

**Why this is a Level 3 / Advanced issue**

- Full-stack: touches models, middleware, route config, and frontend
- Requires atomic increment-and-check (a naïve read-then-write creates a race condition)
- Monthly billing period logic must be timezone-aware
- Must integrate with the existing auth middleware (`req.user`) chain
- The `GET /usage/me` endpoint feeds a real-time UI component
- Directly enables the business model — without this, there is no incentive to upgrade from the free tier

---

**Files to modify**

- `backend/src/models/` — add `usageRecord.model.ts`
- `backend/src/config/` — add `quota.config.ts`
- `backend/src/middleware/` — add `enforceQuota.middleware.ts`
- `backend/src/router/story.route.ts` — apply middleware
- `backend/src/router/continuation.route.ts` — apply middleware
- `backend/src/controllers/` — add `usage.controller.ts`
- `backend/src/router/` — add `usage.route.ts`
- `frontend/src/components/` — add quota indicator + upgrade modal

---

**Additional context**

This issue is distinct from #1516 (payment never upgrades `subscriptionType`). That bug and this feature are complementary — #1516 should be resolved first so users can actually reach `pro` tier, after which this enforcement gives the tier real meaning.

---

**Record**
- [x] I agree to follow this project's Code of Conduct
- [x] I want to work on this issue
