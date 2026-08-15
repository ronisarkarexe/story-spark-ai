import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { analyzeStoryConsistency, trackStoryFacts } from "../../services/consistency.service";
import StoryConsistencyGuardian from "./StoryConsistencyGuardian";

vi.mock("../../services/consistency.service", () => ({
  analyzeStoryConsistency: vi.fn(),
  trackStoryFacts: vi.fn(),
}));

const mockedAnalyzeStoryConsistency = vi.mocked(analyzeStoryConsistency);
const mockedTrackStoryFacts = vi.mocked(trackStoryFacts);

const validStoryText = "This is a valid story text long enough to trigger analysis. ".repeat(3);
const mockConsistencyResult = {
  consistencyScore: 88,
  summary: "Your story is mostly consistent.",
  charactersFound: ["Evan", "Mira"],
  timelineEvents: ["Opening scene", "Final battle"],
  issues: [],
};

const mockFactResult = {
  timeline: [
    {
      stepNumber: 1,
      eventSummary: "A hero awakens",
      factsEstablished: ["Hero wakes up"],
      factsSuperseded: [],
    },
  ],
  contradictions: [],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("StoryConsistencyGuardian", () => {
  it("shows analysis results after running consistency analysis", async () => {
    mockedAnalyzeStoryConsistency.mockResolvedValueOnce(mockConsistencyResult as any);

    render(<StoryConsistencyGuardian />);

    fireEvent.change(screen.getByPlaceholderText(/paste your story here/i), {
      target: { value: validStoryText },
    });

    fireEvent.click(screen.getByRole("button", { name: /analyze consistency/i }));

    await waitFor(() => {
      expect(screen.getByText(/analysis summary/i)).toBeInTheDocument();
      expect(screen.getByText(/your story is mostly consistent/i)).toBeInTheDocument();
    });
  });

  it("clears previous consistency results when story text changes", async () => {
    mockedAnalyzeStoryConsistency.mockResolvedValueOnce(mockConsistencyResult as any);

    render(<StoryConsistencyGuardian />);

    fireEvent.change(screen.getByPlaceholderText(/paste your story here/i), {
      target: { value: validStoryText },
    });
    fireEvent.click(screen.getByRole("button", { name: /analyze consistency/i }));

    await waitFor(() => {
      expect(screen.getByText(/analysis summary/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/paste your story here/i), {
      target: { value: validStoryText + " Updated." },
    });

    await waitFor(() => {
      expect(screen.queryByText(/analysis summary/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/your story is mostly consistent/i)).not.toBeInTheDocument();
    });
  });

  it("clears previous fact-check results when story text changes", async () => {
    mockedTrackStoryFacts.mockResolvedValueOnce(mockFactResult as any);

    render(<StoryConsistencyGuardian />);

    fireEvent.click(screen.getByRole("button", { name: /time-aware fact tracker/i }));
    fireEvent.change(screen.getByPlaceholderText(/paste your story here/i), {
      target: { value: validStoryText },
    });
    fireEvent.click(screen.getByRole("button", { name: /track story facts/i }));

    await waitFor(() => {
      expect(screen.getByText(/timeline contradictions/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/paste your story here/i), {
      target: { value: validStoryText + " Revised." },
    });

    await waitFor(() => {
      expect(screen.queryByText(/timeline contradictions/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/temporal fact timeline/i)).not.toBeInTheDocument();
    });
  });

  it("clears stale error state when story text changes", async () => {
    render(<StoryConsistencyGuardian />);

    fireEvent.change(screen.getByPlaceholderText(/paste your story here/i), {
      target: { value: "short text" },
    });
    fireEvent.click(screen.getByRole("button", { name: /analyze consistency/i }));

    expect(await screen.findByText(/please enter at least 100 characters of story text/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/paste your story here/i), {
      target: { value: "short text updated" },
    });

    await waitFor(() => {
      expect(screen.queryByText(/please enter at least 100 characters of story text/i)).not.toBeInTheDocument();
    });
  });
});
