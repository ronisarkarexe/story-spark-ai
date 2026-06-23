import { User } from "../models/user";

export const needsReadingPreferencesOnboarding = (user?: User | null) => {
  if (!user || user.hasCompletedOnboarding) {
    return false;
  }

  const preferences = user.readingPreferences;

  if (!preferences) {
    return true;
  }

  const hasGenres =
    (preferences.genres?.length ?? 0) > 0 ||
    (preferences.favoriteGenres?.length ?? 0) > 0;
  const hasMoods =
    (preferences.moods?.length ?? 0) > 0 ||
    (preferences.favoriteEmotions?.length ?? 0) > 0;

  return !hasGenres && !hasMoods;
};
