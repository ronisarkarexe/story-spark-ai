import { describe, expect, it } from "vitest";
import { needsReadingPreferencesOnboarding } from "../readingPreferences";
import { User } from "../../models/user";

const baseUser: User = {
  _id: "1",
  email: "reader@example.com",
  name: "Reader",
  password: "",
  role: "user",
  status: "active",
  subscriptionType: "free",
  postsCount: 0,
  followers: [],
  following: [],
  requestsThisMonth: 0,
  lastRequestDate: null,
  posts: [],
  isApplyForWriter: false,
  createdAt: "",
  updatedAt: "",
  profile: { social: {} },
};

describe("needsReadingPreferencesOnboarding", () => {
  it("returns true for new users without onboarding completion", () => {
    expect(needsReadingPreferencesOnboarding(baseUser)).toBe(true);
  });

  it("returns false when onboarding is already completed", () => {
    expect(
      needsReadingPreferencesOnboarding({
        ...baseUser,
        hasCompletedOnboarding: true,
      })
    ).toBe(false);
  });

  it("returns false when reading preferences already exist", () => {
    expect(
      needsReadingPreferencesOnboarding({
        ...baseUser,
        readingPreferences: {
          genres: ["Fantasy"],
          moods: ["Funny"],
          preferredLength: "short",
        },
      })
    ).toBe(false);
  });
});
