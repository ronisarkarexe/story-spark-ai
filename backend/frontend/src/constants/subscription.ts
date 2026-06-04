export enum SUBSCRIPTION_TYPE {
  FREE = "free",
  PRO = "pro",
  PREMIUM = "premium",
}

export type SubscriptionType = "free" | "pro" | "premium";

export const REQUEST_LIMITS = {
  free: 7,
  pro: 49,
  premium: 99,
};
