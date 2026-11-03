import { describe, it, expect } from "vitest";
import {
  calculateWordProgress,
  calculateStoryProgress,
  calculatePromptProgress,
  isGoalCompleted,
  getRemainingWords,
  getRemainingStories,
  getRemainingPrompts,

  getProgressColor,
  resetGoal,
  type WritingGoal,

} from "../writingGoal";

describe("calculateWordProgress", () => {
  it("returns 0 when current is 0", () => {
    expect(calculateWordProgress(0, 100)).toBe(0);
  });

  it("returns 50 when current is half of target", () => {
    expect(calculateWordProgress(50, 100)).toBe(50);
  });


  it("returns 100 when current equals target", () => {
    expect(calculateWordProgress(100, 100)).toBe(100);
  });


  it("caps at 100 when current exceeds target", () => {
    expect(calculateWordProgress(150, 100)).toBe(100);
  });


  it("returns 100 when current equals target", () => {
    expect(calculateWordProgress(100, 100)).toBe(100);

  it("returns NaN when current and target are both 0 (divide by zero)", () => {
    // Division by zero produces NaN; this documents the current behavior
    expect(Number.isNaN(calculateWordProgress(0, 0))).toBe(true);

  });
});

describe("calculateStoryProgress", () => {
  it("returns 0 when current is 0", () => {
    expect(calculateStoryProgress(0, 5)).toBe(0);
  });


  it("returns correct percentage for partial progress", () => {
    expect(calculateStoryProgress(2, 5)).toBe(40);
  });


  it("caps at 100 when current exceeds target", () => {
    expect(calculateStoryProgress(10, 5)).toBe(100);
  });
});

describe("calculatePromptProgress", () => {
  it("returns 0 when current is 0", () => {
    expect(calculatePromptProgress(0, 3)).toBe(0);
  });


  it("returns 100 when current equals target", () => {
    expect(calculatePromptProgress(3, 3)).toBe(100);

  it("returns correct percentage for partial progress", () => {
    expect(calculatePromptProgress(1, 3)).toBeCloseTo(33.33, 1);
  });

  it("caps at 100 when current exceeds target", () => {
    expect(calculatePromptProgress(5, 3)).toBe(100);

  });
});

describe("isGoalCompleted", () => {

  it("returns true when current is greater than target", () => {
    expect(isGoalCompleted(110, 100)).toBe(true);
  });

  it("returns true when current equals target", () => {
    expect(isGoalCompleted(100, 100)).toBe(true);
  });

  it("returns false when current is less than target", () => {
    expect(isGoalCompleted(99, 100)).toBe(false);

  it("returns false when current is less than target", () => {
    expect(isGoalCompleted(49, 50)).toBe(false);
  });

  it("returns true when current equals target", () => {
    expect(isGoalCompleted(50, 50)).toBe(true);
  });

  it("returns true when current exceeds target", () => {
    expect(isGoalCompleted(100, 50)).toBe(true);
  });

  it("returns false when current is 0 and target is positive", () => {
    expect(isGoalCompleted(0, 100)).toBe(false);

  });
});

describe("getRemainingWords", () => {

  it("returns target - current when current is less than target", () => {

  it("returns target minus current when current is less than target", () => {

    expect(getRemainingWords(30, 100)).toBe(70);
  });

  it("returns 0 when current equals target", () => {
    expect(getRemainingWords(100, 100)).toBe(0);
  });


  it("returns 0 when current exceeds target (never negative)", () => {
    expect(getRemainingWords(150, 100)).toBe(0);
  });
});

describe("getRemainingStories", () => {
  it("returns target - current", () => {
    expect(getRemainingStories(2, 5)).toBe(3);
  });

  it("never returns negative", () => {
    expect(getRemainingStories(10, 5)).toBe(0);
  });
});

describe("getRemainingPrompts", () => {
  it("returns target - current", () => {
    expect(getRemainingPrompts(1, 3)).toBe(2);
  });

  it("never returns negative", () => {
    expect(getRemainingPrompts(5, 3)).toBe(0);
  });
});

describe("getProgressColor", () => {
  it("returns red when progress is less than 40", () => {
    expect(getProgressColor(0)).toBe("red");
    expect(getProgressColor(39)).toBe("red");
  });

  it("returns yellow when progress is 40 or more but less than 70", () => {
    expect(getProgressColor(40)).toBe("yellow");
    expect(getProgressColor(69)).toBe("yellow");
  });

  it("returns blue when progress is 70 or more but less than 100", () => {
    expect(getProgressColor(70)).toBe("blue");
    expect(getProgressColor(99)).toBe("blue");
  });

  it("returns green when progress is 100 or more", () => {
    expect(getProgressColor(100)).toBe("green");
    expect(getProgressColor(150)).toBe("green");
  });
});

describe("resetGoal", () => {
  it("resets word, story, and prompt counters to 0", () => {
    const goal: WritingGoal = {
      goalType: "daily",
      targetWords: 1000,
      targetStories: 3,
      targetPrompts: 5,
      wordsWritten: 500,
      storiesWritten: 1,
      promptsCompleted: 2,
    };

    const reset = resetGoal(goal);

    expect(reset.wordsWritten).toBe(0);
    expect(reset.storiesWritten).toBe(0);
    expect(reset.promptsCompleted).toBe(0);
  });

  it("preserves goal type and targets", () => {
    const goal: WritingGoal = {
      goalType: "weekly",
      targetWords: 5000,
      targetStories: 10,
      targetPrompts: 20,
      wordsWritten: 1000,
      storiesWritten: 2,
      promptsCompleted: 5,
    };

    const reset = resetGoal(goal);

    expect(reset.goalType).toBe("weekly");
    expect(reset.targetWords).toBe(5000);
    expect(reset.targetStories).toBe(10);
    expect(reset.targetPrompts).toBe(20);
  });

  it("returns a new object, does not mutate the original", () => {
    const goal: WritingGoal = {
      goalType: "daily",
      targetWords: 500,
      targetStories: 2,
      targetPrompts: 3,
      wordsWritten: 250,
      storiesWritten: 1,
      promptsCompleted: 1,
    };

    const reset = resetGoal(goal);

    expect(goal.wordsWritten).toBe(250);
    expect(reset).not.toBe(goal);

  it("returns 0 when current exceeds target", () => {
    expect(getRemainingWords(150, 100)).toBe(0);
  });

  it("returns target when current is 0", () => {
    expect(getRemainingWords(0, 50)).toBe(50);
  });
});

describe("getRemainingStories", () => {
  it("returns correct remaining stories", () => {
    expect(getRemainingStories(1, 5)).toBe(4);
  });

  it("returns 0 when current equals target", () => {
    expect(getRemainingStories(5, 5)).toBe(0);
  });

  it("returns 0 when current exceeds target", () => {
    expect(getRemainingStories(10, 5)).toBe(0);
  });
});

describe("getRemainingPrompts", () => {
  it("returns correct remaining prompts", () => {
    expect(getRemainingPrompts(2, 7)).toBe(5);
  });

  it("returns 0 when current equals target", () => {
    expect(getRemainingPrompts(7, 7)).toBe(0);
  });

  it("returns 0 when current exceeds target", () => {
    expect(getRemainingPrompts(10, 7)).toBe(0);
  });
});
