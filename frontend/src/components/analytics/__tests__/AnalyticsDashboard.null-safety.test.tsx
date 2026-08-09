/**
 * Regression test for issue #1048 — AnalyticsDashboard crashes with
 * "Cannot read properties of undefined (reading 'reduce')" when the analytics
 * API returns a 2xx response whose `data` field is missing/null (partial
 * payload, shape drift, empty account). The setters used to overwrite the []
 * initial state with undefined, so the later .reduce()/spread calls in render
 * threw and took down the whole /analytics route.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AnalyticsDashboard from "../AnalyticsDashboard";

// recharts uses ResponsiveContainer which needs a non-zero size in jsdom.
vi.mock("recharts", () => {
  const React = require("react");
  const Noop = ({ children }: { children?: React.ReactNode }) =>
    React.createElement("div", null, children);
  return {
    ResponsiveContainer: Noop,
    BarChart: Noop,
    Bar: Noop,
    XAxis: Noop,
    YAxis: Noop,
    Tooltip: Noop,
    PieChart: Noop,
    Pie: Noop,
    Cell: Noop,
    CartesianGrid: Noop,
    LineChart: Noop,
    Line: Noop,
  };
});

const fakeFetch = vi.fn();

describe("AnalyticsDashboard null-safety (issue #1048)", () => {
  beforeEach(() => {
    global.fetch = fakeFetch as unknown as typeof fetch;
    // token present so the load path runs
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => "fake-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("renders without crashing when the API omits the `data` field", async () => {
    // Every endpoint returns 200 OK but with no `data` field → fetchData
    // returns undefined for all five calls. This used to crash in render.
    fakeFetch.mockImplementation(async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as unknown as Response));

    let renderError: unknown = undefined;
    try {
      render(
        <MemoryRouter>
          <AnalyticsDashboard />
        </MemoryRouter>
      );
    } catch (e) {
      renderError = e;
    }

    expect(renderError).toBeUndefined();
    await waitFor(() => expect(screen.getByText(/Analytics|Overview|stories|activity|No/i)).toBeTruthy(), { timeout: 3000 });
  });

  it("renders without crashing when the API returns null data fields", async () => {
    fakeFetch.mockImplementation(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: null }),
    } as unknown as Response));

    let renderError: unknown = undefined;
    try {
      render(
        <MemoryRouter>
          <AnalyticsDashboard />
        </MemoryRouter>
      );
    } catch (e) {
      renderError = e;
    }

    expect(renderError).toBeUndefined();
    await waitFor(() => expect(screen.getByText(/Analytics|Overview|stories|activity|No/i)).toBeTruthy(), { timeout: 3000 });
  });

  it("renders populated data without throwing", async () => {
    const overview = {
      totalStories: 5, totalWords: 1200, currentStreak: 2, longestStreak: 3,
      totalLikes: 10, totalViews: 99, storyLengths: { short: 2, medium: 2, long: 1 },
    };
    const heatmap = [{ date: "2026-01-01", count: 3 }, { date: "2026-01-02", count: 1 }];
    const genres = [{ genre: "Fantasy", count: 3 }, { genre: "Sci-Fi", count: 2 }];
    const wordcloud = [{ text: "dragon", value: 4 }];
    const hours = [{ hour: 9, count: 5 }, { hour: 10, count: 2 }];
    const payloads: Record<string, unknown> = {
      overview, heatmap, genres, wordcloud, hours,
    };

    fakeFetch.mockImplementation(async (url: string) => {
      const endpoint = url.split("/analytics/")[1];
      return {
        ok: true,
        status: 200,
        json: async () => ({ data: payloads[endpoint] }),
      } as unknown as Response;
    });

    let renderError: unknown = undefined;
    try {
      render(
        <MemoryRouter>
          <AnalyticsDashboard />
        </MemoryRouter>
      );
    } catch (e) {
      renderError = e;
    }

    expect(renderError).toBeUndefined();
    await waitFor(() => expect(screen.getByText(/Analytics|Overview|stories/i)).toBeTruthy(), { timeout: 3000 });
  });
});
