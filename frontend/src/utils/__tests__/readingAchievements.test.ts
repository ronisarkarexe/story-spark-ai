import { describe, it, expect } from 'vitest';
import { getAchievementBadges } from '../readingAchievements';

describe('readingAchievements utility', () => {
  it('should return all badges locked for 0 metrics', () => {
    const badges = getAchievementBadges(0, 0, 0);
    expect(badges.every((b) => !b.unlocked)).toBe(true);
  });

  it('should unlock First Story badge when storiesRead >= 1', () => {
    const badges = getAchievementBadges(1, 0, 0);
    const firstStoryBadge = badges.find((b) => b.id === 1);
    expect(firstStoryBadge?.unlocked).toBe(true);
  });

  it('should unlock all badges when user reaches high progress', () => {
    const badges = getAchievementBadges(10, 5, 7);
    expect(badges.every((b) => b.unlocked)).toBe(true);
  });
});
