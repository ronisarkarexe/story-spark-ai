import { useState } from "react";
import { isLoggedIn } from "../../services/auth.service";
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
import { needsReadingPreferencesOnboarding } from "../../utils/readingPreferences";
import ReadingPreferencesOnboarding from "./ReadingPreferencesOnboarding";

const ReadingPreferencesOnboardingGate = () => {
  const loggedIn = isLoggedIn();
  const { data: profile, isLoading, refetch } = useGetProfileInfoQuery(undefined, {
    skip: !loggedIn,
  });
  const [dismissedLocally, setDismissedLocally] = useState(false);

  if (!loggedIn || isLoading || dismissedLocally) {
    return null;
  }

  if (!needsReadingPreferencesOnboarding(profile)) {
    return null;
  }

  return (
    <ReadingPreferencesOnboarding
      onComplete={() => {
        setDismissedLocally(true);
        refetch();
      }}
    />
  );
};

export default ReadingPreferencesOnboardingGate;
