export type OnboardingAnalyticsEvent =
  | "onboarding_started"
  | "genre_step_completed"
  | "length_step_completed"
  | "mood_step_completed"
  | "onboarding_completed"
  | "onboarding_skipped";

export const trackOnboardingEvent = (
  event: OnboardingAnalyticsEvent,
  detail?: Record<string, unknown>
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("storyspark:onboarding", {
      detail: { event, ...detail },
    })
  );
};
