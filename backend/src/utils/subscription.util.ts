import { SUBSCRIPTION_TYPE, SubscriptionType } from "../enums/subscription_type";

export type SubscriptionPlanUser = {
  _id?: unknown;
  subscriptionType?: string | null;
  subscriptionExpiry?: Date | string | null;
};

/**
 * Resolve the plan that should actually be enforced for quota / rate limits.
 * Expired paid subscriptions are treated as free.
 */
export const resolveEffectivePlan = (
  user: SubscriptionPlanUser | null | undefined
): SubscriptionType => {
  const plan = (user?.subscriptionType || SUBSCRIPTION_TYPE.FREE) as SubscriptionType;
  if (plan === SUBSCRIPTION_TYPE.FREE) {
    return SUBSCRIPTION_TYPE.FREE;
  }

  const expiry = user?.subscriptionExpiry;
  if (expiry && new Date(expiry).getTime() < Date.now()) {
    return SUBSCRIPTION_TYPE.FREE;
  }

  return plan;
};

/** True when the user still has a paid subscriptionType but the expiry has passed. */
export const isPaidSubscriptionExpired = (
  user: SubscriptionPlanUser | null | undefined
): boolean => {
  const plan = user?.subscriptionType || SUBSCRIPTION_TYPE.FREE;
  if (plan === SUBSCRIPTION_TYPE.FREE) return false;
  const expiry = user?.subscriptionExpiry;
  return Boolean(expiry && new Date(expiry).getTime() < Date.now());
};
