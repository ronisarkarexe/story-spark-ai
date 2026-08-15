import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRevisionPlanner } from "../useRevisionPlanner";
import { generateRevisionPlan } from "../../utils/revisionPlanner";

describe("useRevisionPlanner", () => {
  it("populates tasks via the planner after mount for a story that yields tasks", () => {
    const story = "tiny"; // < 1500 chars -> Strengthen Introduction + Review Ending
    const expected = generateRevisionPlan(story);
    const { result } = renderHook(() => useRevisionPlanner(story));
    expect(result.current.tasks).toEqual(expected);
    expect(result.current.tasks.length).toBeGreaterThan(0);
  });

  it("always includes the Review Ending task", () => {
    const { result } = renderHook(() =>
      useRevisionPlanner("A fully developed long story " + "x".repeat(2000))
    );
    const ending = result.current.tasks.find((t) => t.title === "Review Ending");
    expect(ending).toBeDefined();
    expect(ending!.category).toBe("Ending");
  });

  it("adds the Strengthen Introduction task for a short story", () => {
    const { result } = renderHook(() => useRevisionPlanner("tiny"));
    const intro = result.current.tasks.find((t) => t.title === "Strengthen Introduction");
    expect(intro).toBeDefined();
    expect(intro!.priority).toBe("High");
    expect(intro!.category).toBe("Introduction");
  });

  it("does not add the Strengthen Introduction task for a long story", () => {
    const longStory = "x".repeat(2000);
    const { result } = renderHook(() => useRevisionPlanner(longStory));
    const intro = result.current.tasks.find((t) => t.title === "Strengthen Introduction");
    expect(intro).toBeUndefined();
  });

  it("adds the Improve Scene Transition task when 'suddenly' appears", () => {
    const longStory = "x".repeat(1600) + " suddenly the dragon appeared " + "y".repeat(50);
    const { result } = renderHook(() => useRevisionPlanner(longStory));
    const transition = result.current.tasks.find((t) => t.title === "Improve Scene Transition");
    expect(transition).toBeDefined();
    expect(transition!.category).toBe("Plot");
  });

  it("exposes setTasks so callers can override the tasks", () => {
    const { result } = renderHook(() => useRevisionPlanner("tiny"));
    expect(result.current.tasks.length).toBeGreaterThan(0);
    act(() => {
      result.current.setTasks([
        {
          id: 42,
          title: "Manual task",
          description: "manually added",
          priority: "Low",
          category: "Grammar",
          completed: true,
        },
      ]);
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].id).toBe(42);
    expect(result.current.tasks[0].completed).toBe(true);
  });

  it("recomputes tasks when the story changes", () => {
    const { result, rerender } = renderHook(
      ({ story }: { story: string }) => useRevisionPlanner(story),
      { initialProps: { story: "x".repeat(2000) } }
    );
    const longTasks = result.current.tasks;
    expect(longTasks.find((t) => t.title === "Strengthen Introduction")).toBeUndefined();

    rerender({ story: "tiny" });
    expect(result.current.tasks.find((t) => t.title === "Strengthen Introduction")).toBeDefined();
  });
});
