const { execSync } = require('child_process');

const issues = [
  {
    title: "Bug: PII Scrubber Detection Edge-Cases Missed",
    label: "bug",
    body: `### Overview
The current Personally Identifiable Information (PII) scrubber implementation located in \`backend/src/app/middleware/pii_scrubber.ts\` requires critical updates. It is currently missing several edge cases which allows sensitive information to pass through without being properly obfuscated.

### Current Behavior
During execution, the regex patterns utilized by the PII scrubber fail to detect certain variations of personally identifiable data. This creates a potential privacy violation where user data could be logged or stored un-scrubbed.

### Expected Behavior
The scrubber should robustly detect all forms of standard PII, including names, phone numbers, addresses, and emails, regardless of minor formatting variations.

### Steps to Reproduce / Affected Files
1. Review \`backend/src/app/middleware/pii_scrubber.ts\`
2. Notice the missing edge case regex coverage for complex strings.
3. Review corresponding tests in \`backend/src/__tests__/piiScrubber.test.ts\`

### Suggested Solution
- Update the regex patterns to handle advanced formatting (e.g., international phone numbers, complex email aliases).
- Expand unit tests to comprehensively cover these new edge cases.
- Refer to issue #3651 context documented in \`TODO.md\`.`
  },
  {
    title: "Bug: Corrupted Authentication Middleware Requires Rewrite",
    label: "bug",
    body: `### Overview
The primary authentication and authorization middleware (\`backend/src/app/middleware/auth.middleware.ts\`) is currently corrupted or improperly implemented. A full rewrite is necessary to ensure secure and deterministic token validation.

### Current Behavior
The middleware fails to properly validate JWTs across all required scenarios. Specifically, token version checks, TokenBlacklist validation, and Role-Based Access Control (RBAC) mechanisms are unreliable or completely broken.

### Expected Behavior
A robust \`auth(...requiredRole)\` middleware that extracts Bearer tokens/cookies, verifies them against the JWT secret, checks the \`TokenBlacklist\`, validates the \`tokenVersion\` and \`ACTIVE\` status of the \`User\` document, and strictly enforces role requirements.

### Steps to Reproduce / Affected Files
- File: \`backend/src/app/middleware/auth.middleware.ts\`
- See tracking document: \`TODO_AUTH_MW_FIX.md\`

### Suggested Solution
1. Rewrite the \`auth\` function from scratch.
2. Implement proper token extraction logic.
3. Add robust error handling (e.g., \`TokenExpiredError\`, \`JsonWebTokenError\`).
4. Ensure \`(req as any).user = user\` is strictly typed if possible.`
  },
  {
    title: "Feature: Implement Quota Enforcement on AI Generation Endpoints",
    label: "enhancement",
    body: `### Overview
Currently, the core AI story generation endpoints lack proper usage quota enforcement. This means any free user can infinitely call the expensive AI endpoints, making paid subscription tiers commercially meaningless.

### Current Behavior
Endpoints such as \`POST /api/v1/story/generate\` and \`POST /api/v1/story-continuation/continue\` bypass any checks against the user's \`subscriptionType\`.

### Expected Behavior
Users should be limited to a specific number of AI generations per billing cycle based on their plan (e.g., Free = 5, Pro = 50, Elite = Unlimited). When a quota is exceeded, the server should return a \`429 QUOTA_EXCEEDED\` status.

### Steps to Reproduce / Affected Files
1. Sign up as a free user.
2. Hit the \`/generate\` endpoint repeatedly.
3. Notice that no blocking or rate-limiting occurs.
4. See \`issue_quota.md\` for the full architectural gap analysis.

### Suggested Solution
- Create a new \`UsageRecord\` MongoDB model to track monthly usage.
- Implement an \`enforceQuota\` middleware that atomically increments and checks usage limits before invoking AI logic.
- Add a new endpoint \`GET /api/v1/usage/me\` to feed a real-time quota indicator in the UI.`
  },
  {
    title: "Bug: Payment Flow Fails to Upgrade User Subscription Tier",
    label: "bug",
    body: `### Overview
A critical bug exists within the Razorpay payment flow where successful payments do not correctly update the user's document in the database to reflect their new \`subscriptionType\`.

### Current Behavior
When a user completes a transaction to upgrade to "Pro", the webhook/callback fails to apply the upgrade to the \`User\` document. The user is charged, but their account remains on the "Free" tier.

### Expected Behavior
Upon successful payment verification, the backend should locate the corresponding \`User\` document and atomically update the \`subscriptionType\` field to match the purchased plan.

### Steps to Reproduce / Affected Files
- Complete a Razorpay transaction in the frontend.
- Check the database for the user's \`subscriptionType\`.
- Ref: \`issue_quota.md\` (mentions Issue #1516).

### Suggested Solution
- Investigate the Razorpay webhook handler in \`payment.controller.ts\` or equivalent.
- Ensure proper error handling and logging is in place for payment verification.
- Add an integration test to simulate the payment callback and verify the database update.`
  },
  {
    title: "Refactor: Replace Raw console.log with Proper Logger in Backend Services",
    label: "enhancement",
    body: `### Overview
Several critical backend services are utilizing unformatted, raw \`console.log()\` statements instead of the standardized logging utility (\`logger.util.ts\`). This creates unstructured, noisy, and potentially untraceable production logs.

### Current Behavior
Files such as \`ai.service.ts\`, \`verify_email.service.ts\`, and \`character_network.utils.ts\` use \`console.log\` directly for tracking events like fallback logic, OTP generation, and cache hits.

### Expected Behavior
All production logging should go through a structured logger (e.g., Winston/Pino based \`logger.util.ts\`) to ensure proper severity levels (info, warn, error), timestamps, and potential third-party log ingestion formatting.

### Steps to Reproduce / Affected Files
Run a global search for \`console.log\` in \`backend/src/services/\` and \`backend/src/app/modules/\`.

### Suggested Solution
- Import the custom logger utility in all affected files.
- Replace \`console.log\` with \`logger.info\`, \`logger.warn\`, or \`logger.error\` as appropriate.
- Remove redundant development-only logging in production branches.`
  },
  {
    title: "Refactor: Eliminate Widespread Usage of 'any' Type in Backend",
    label: "enhancement",
    body: `### Overview
The backend TypeScript codebase currently relies heavily on the \`any\` type. This negates the primary benefit of TypeScript, bypassing compile-time safety checks and increasing the risk of runtime exceptions.

### Current Behavior
Files such as \`analysis.service.ts\`, \`story.routes.ts\`, \`handle_duplicate_error.ts\`, and \`payment.controller.ts\` cast variables, request bodies, and error objects to \`any\`. 

### Expected Behavior
All inputs, outputs, and intermediate variables should be strictly typed using appropriate Interfaces, Types, or built-in generic types (e.g., \`unknown\` for caught errors).

### Steps to Reproduce / Affected Files
Run a regex search for \`: any\` across the \`backend/src\` directory. Over 30 instances exist in core service layers and controllers.

### Suggested Solution
- Define rigorous TypeScript interfaces for AI responses, Razorpay payloads, and Express Request objects.
- Use the \`unknown\` type for \`catch (error: unknown)\` blocks, followed by type narrowing or \`instanceof\` checks.
- Enable stricter \`tsconfig.json\` rules (e.g., \`noImplicitAny\`) incrementally.`
  },
  {
    title: "Cleanup: Remove Leftover Debugging console.log Statements in Frontend",
    label: "enhancement",
    body: `### Overview
There are several leftover \`console.log\` statements in the frontend application that were likely used during development but have accidentally made it into the production codebase.

### Current Behavior
Components such as \`StoryWorkspace.tsx\`, \`CollabRoom.tsx\`, and \`socket.oi.ts\` actively log internal state changes, selected prompts, socket reconnect events, and other user actions to the browser console.

### Expected Behavior
Production builds should not leak internal state or application flow information to the client console. It creates unnecessary noise and can expose sensitive application logic.

### Steps to Reproduce / Affected Files
- \`frontend/src/components/story/StoryWorkspace.tsx\`
- \`frontend/src/components/collab/CollabRoom.tsx\`
- \`frontend/src/socket/socket.oi.ts\`

### Suggested Solution
- Remove all unnecessary \`console.log\` statements.
- For necessary analytics or error logging, implement a proper frontend logging utility (like Sentry or a custom wrapper) that strips logs out of production builds based on \`process.env.NODE_ENV\`.`
  },
  {
    title: "Feature: Add Word-Level Diff Option in Story Variation Comparison Mode",
    label: "enhancement",
    body: `### Overview
The current Story Variation Comparison Mode effectively visualizes changes between AI-generated story drafts. However, it relies solely on character-level diffing (\`diffChars\` from \`jsdiff\`). For prose and creative writing, character-level diffs can sometimes be difficult to read.

### Current Behavior
If a user changes "happy" to "happier", the diff highlights individual letters, which can create visually cluttered diffs for large paragraphs.

### Expected Behavior
Users should have a toggle or an automatic fallback to use word-level diffing (\`diffWords\`), which compares entire words, making prose changes much more legible.

### Steps to Reproduce / Affected Files
- Review \`frontend/src/components/story-comparison/DiffViewer.tsx\`
- See "Future Enhancement Ideas" in \`STORY_COMPARISON_IMPLEMENTATION.md\`.

### Suggested Solution
- Import \`diffWords\` from the \`jsdiff\` library.
- Add a UI toggle switch in the \`VariationSelector\` or \`DiffViewer\` to switch between "Character Level" and "Word Level" precision.
- Update the state and rerender the diff panels based on the selected algorithm.`
  },
  {
    title: "Enhancement: Polish Password Visibility Accessibility UX",
    label: "enhancement",
    body: `### Overview
While the password visibility toggle has been heavily upgraded for WCAG accessibility (space/enter toggles, ARIA labels), the user experience can still be polished further to feel more premium and intuitive.

### Current Behavior
The accessibility tooltip appears instantly or with a basic hover, lacking smooth transitions. Additionally, its placement is static and might clip off-screen on certain mobile viewports.

### Expected Behavior
The tooltip should fade in smoothly with CSS transitions, and its positioning should be "smart" (e.g., utilizing a library like Floating UI or dynamic CSS calculations) to prevent overflow on small screens.

### Steps to Reproduce / Affected Files
- Open the login or signup page.
- Hover over the password eye icon.
- Reference "Future Enhancements" in \`PASSWORD_VISIBILITY_ACCESSIBILITY.md\`.

### Suggested Solution
- Add CSS fade-in animations (\`transition-opacity duration-300\`).
- Implement dynamic positioning (top/bottom) based on viewport bounding boxes.
- Consider adding an optional confirmation modal for showing passwords on public/shared devices.`
  },
  {
    title: "DevOps: Resolve Socket.IO Deployment Limitation on Vercel",
    label: "documentation",
    body: `### Overview
The architecture explicitly states that Socket.IO cannot run on Vercel's serverless environment. This creates a deployment friction point, forcing developers to spin up a secondary persistent host (like Render) just for WebSocket capabilities.

### Current Behavior
Attempting to deploy the backend fully on Vercel breaks the real-time notification system because serverless functions immediately close connections after returning an HTTP response, making persistent WebSockets impossible.

### Expected Behavior
The application should either have a seamless fallback to HTTP Long-Polling that is compatible with serverless architecture, or the deployment documentation/infrastructure scripts should automatically provision a persistent service for the WebSocket layer.

### Steps to Reproduce / Affected Files
- Read \`ARCHITECTURE.md\` (Deployment section).
- Attempt to connect the frontend to a Vercel-hosted backend URL via \`VITE_SOCKET_URL\`.

### Suggested Solution
- Evaluate migrating from standard Socket.IO to a serverless-friendly real-time service like Pusher, Ably, or AWS API Gateway WebSockets.
- Alternatively, write extensive documentation and provide Terraform/Render \`yaml\` configuration files to cleanly deploy the Node.js API to a persistent environment by default.`
  }
];

issues.forEach(issue => {
  console.log("Creating issue: " + issue.title);
  const escapedTitle = issue.title.replace(/"/g, '\\"');
  try {
    execSync('gh issue create --title "' + escapedTitle + '" --label "' + issue.label + '" --body-file -', {
      input: issue.body,
      stdio: ['pipe', 'inherit', 'inherit']
    });
  } catch (e) {
    console.error("Failed to create issue: " + issue.title);
  }
});
