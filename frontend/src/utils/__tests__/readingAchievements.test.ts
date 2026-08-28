import { describe, it, expect } from 'vitest';
import { getAchievementBadges } from '../readingAchievements';

describe('readingAchievements utility', () => {
  it('should return all badges locked for 0 progress', () => {
    const badges = getAchievementBadges(0, 0, 0);
    expect(badges.every((b) => !b.unlocked)).toBe(true);
  });

  it('should unlock First Story badge when storiesRead >= 1', () => {
    const badges = getAchievementBadges(1, 0, 0);
    const firstStory = badges.find((b) => b.id === 1);
    expect(firstStory?.unlocked).toBe(true);
  });
});
