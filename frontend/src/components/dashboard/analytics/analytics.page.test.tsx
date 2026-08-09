import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AnalyticsPage from "./analytics.page";

vi.mock("../../../services/auth.service", () => ({
  getToken: vi.fn(() => "test-token"),
}));

vi.mock("../../../helpers/config", () => ({
  getBaseUrl: vi.fn(() => "http://localhost:5000/api/v1"),
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children?: unknown }) => (
    <div data-testid="chart">{children as never}</div>
  ),
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
  PieChart: () => <div data-testid="pie-chart" />,
  Pie: () => null,
  Cell: () => null,
}));

const emptyOverview = {
  totalStories: 0,
  totalWords: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalLikes: 0,
  totalViews: 0,
};

const okJson = (data: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({ data }),
  } as Response);

const statusResponse = (status: number) =>
  Promise.resolve({
    ok: false,
    status,
    json: async () => ({ message: "error" }),
  } as Response);

const malformedJsonResponse = () =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError("Unexpected token");
    },
  } as Response);

const endpointFromUrl = (input: RequestInfo | URL) => {
  const url = String(input);
  const match = url.match(/\/analytics\/([^/?#]+)/);
  return match?.[1] ?? "";
};

const mockAllOk = (overview = emptyOverview) => {
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL) => {
      const endpoint = endpointFromUrl(input);
      switch (endpoint) {
        case "overview":
          return okJson(overview);
        case "heatmap":
          return okJson([]);
        case "genres":
          return okJson([]);
        case "wordcloud":
          return okJson([]);
        case "productive-hours":
          return okJson([]);
        default:
          return statusResponse(404);
      }
    })
  );
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <AnalyticsPage />
    </MemoryRouter>
  );

describe("AnalyticsPage request failure handling", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("shows an auth-expired state with sign-in for 401 responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => statusResponse(401))
    );

    renderPage();

    expect(
      await screen.findByText(
        "Your session has expired. Sign in again to view analytics."
      )
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Sign in" }).getAttribute("href")
    ).toBe("/login");
    expect(screen.queryByText("Your Analytics")).toBeNull();
    expect(screen.queryByText("No stories yet — generate some!")).toBeNull();
  });

  it("shows a retryable error state for 5xx responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => statusResponse(500))
    );

    renderPage();

    expect(
      await screen.findByText("Failed to load analytics. Please try again.")
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
    expect(screen.queryByText("Your Analytics")).toBeNull();
  });

  it("treats malformed JSON as a load failure, not empty analytics", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => malformedJsonResponse())
    );

    renderPage();

    expect(
      await screen.findByText("Failed to load analytics. Please try again.")
    ).toBeTruthy();
    expect(screen.queryByText("No stories yet — generate some!")).toBeNull();
  });

  it("fails the whole load when one endpoint errors among successful ones", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const endpoint = endpointFromUrl(input);
        if (endpoint === "genres") {
          return statusResponse(500);
        }
        return okJson(
          endpoint === "overview" ? emptyOverview : []
        );
      })
    );

    renderPage();

    expect(
      await screen.findByText("Failed to load analytics. Please try again.")
    ).toBeTruthy();
    expect(screen.queryByText("Your Analytics")).toBeNull();
  });

  it("recovers to the dashboard after Retry succeeds", async () => {
    let shouldFail = true;
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        if (shouldFail) {
          return statusResponse(500);
        }
        const endpoint = endpointFromUrl(input);
        return okJson(endpoint === "overview" ? emptyOverview : []);
      })
    );

    renderPage();

    expect(
      await screen.findByText("Failed to load analytics. Please try again.")
    ).toBeTruthy();

    shouldFail = false;
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("Your Analytics")).toBeTruthy();
    expect(screen.getByText("No stories yet — generate some!")).toBeTruthy();
  });

  it("renders a true zero-activity dashboard when requests succeed with empty data", async () => {
    mockAllOk(emptyOverview);

    renderPage();

    expect(await screen.findByText("Your Analytics")).toBeTruthy();
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
    expect(screen.getAllByText("0d").length).toBe(2);
    expect(screen.getByText("No stories yet — generate some!")).toBeTruthy();
    expect(screen.getByText("No activity data yet — start writing!")).toBeTruthy();
    expect(
      screen.queryByText("Failed to load analytics. Please try again.")
    ).toBeNull();
  });
});
