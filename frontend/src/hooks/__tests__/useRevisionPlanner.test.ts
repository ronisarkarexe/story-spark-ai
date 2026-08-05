import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRevisionPlanner } from "../useRevisionPlanner";
import type { RevisionTask } from "../../types/revision";

const mockTask: RevisionTask = {
  id: 1,
  title: "Strengthen Introduction",
  description: "The opening could better hook readers.",
  priority: "High",
  category: "Introduction",
  completed: false,
};

vi.mock("../../utils/revisionPlanner", () => ({
  generateRevisionPlan: vi.fn(),
}));

import { generateRevisionPlan } from "../../utils/revisionPlanner";

const mockedGenerateRevisionPlan = generateRevisionPlan as ReturnType<typeof vi.fn>;

describe("useRevisionPlanner hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an empty tasks array initially", () => {
    mockedGenerateRevisionPlan.mockReturnValue([]);
    const { result } = renderHook(() => useRevisionPlanner("test story"));
    expect(result.current.tasks).toEqual([]);
  });

  it("calls generateRevisionPlan with the story prop", () => {
    mockedGenerateRevisionPlan.mockReturnValue([]);
    const story = "This is a short story.";
    renderHook(() => useRevisionPlanner(story));
    expect(mockedGenerateRevisionPlan).toHaveBeenCalledWith(story);
  });

  it("calls generateRevisionPlan only once on mount", () => {
    mockedGenerateRevisionPlan.mockReturnValue([]);
    renderHook(() => useRevisionPlanner("any story"));
    expect(mockedGenerateRevisionPlan).toHaveBeenCalledTimes(1);
  });

  it("returns tasks from generateRevisionPlan", () => {
    mockedGenerateRevisionPlan.mockReturnValue([mockTask]);
    const { result } = renderHook(() => useRevisionPlanner("A short story."));
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe(1);
    expect(result.current.tasks[0].title).toBe("Strengthen Introduction");
    expect(result.current.tasks[0].priority).toBe("High");
  });

  it("updates tasks when story prop changes", () => {
    mockedGenerateRevisionPlan
      .mockReturnValueOnce([mockTask])
      .mockReturnValueOnce([]);
    const { result, rerender } = renderHook(
      ({ story }: { story: string }) => useRevisionPlanner(story),
      { initialProps: { story: "story 1" } }
    );
    expect(result.current.tasks).toHaveLength(1);
    rerender({ story: "story 2" });
    expect(result.current.tasks).toHaveLength(0);
  });

  it("allows setTasks to directly update tasks state", () => {
    mockedGenerateRevisionPlan.mockReturnValue([]);
    const newTask: RevisionTask = {
      id: 2,
      title: "Improve Scene Transition",
      description: "Some transitions feel abrupt.",
      priority: "Medium",
      category: "Plot",
      completed: false,
    };
    const { result } = renderHook(() => useRevisionPlanner("story"));
    act(() => {
      result.current.setTasks([newTask]);
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe(2);
  });
});
