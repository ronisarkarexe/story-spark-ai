import {
  SUBSCRIPTION_TYPE,
  SubscriptionType,
} from "../../../enums/subscription_type";

export interface IPlanPricing {
  subscriptionType: SubscriptionType;
  amount: number;
  currency: string;
}

// Server side source of truth for paid plan prices. Amounts are in paise (INR).
export const PLAN_PRICING: Record<string, IPlanPricing> = {
  pro: {
    subscriptionType: SUBSCRIPTION_TYPE.PRO,
    amount: 149900,
    currency: "INR",
  },
  premium: {
    subscriptionType: SUBSCRIPTION_TYPE.PREMIUM,
    amount: 399900,
    currency: "INR",
  },
};

const PLAN_ALIASES: Record<string, string> = {
  pro: "pro",
  premium: "premium",
  enterprise: "premium",
};

// Maps any accepted client plan label to a known paid plan key, or null.
export const normalizePlan = (raw: unknown): string | null => {
  if (typeof raw !== "string") return null;
  return PLAN_ALIASES[raw.trim().toLowerCase()] ?? null;
};
