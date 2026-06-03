import { SUBSCRIPTION_TYPE } from "../enums/subscription_type";

export const PLAN_QUOTAS = {
  [SUBSCRIPTION_TYPE.FREE]: { story_generate: 5, story_continue: 3 },
  [SUBSCRIPTION_TYPE.PRO]: { story_generate: 50, story_continue: 30 },
  [SUBSCRIPTION_TYPE.PREMIUM]: { story_generate: Infinity, story_continue: Infinity },
};
