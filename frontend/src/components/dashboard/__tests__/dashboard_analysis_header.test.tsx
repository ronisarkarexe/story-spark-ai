// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import DashboardAnalysisHeader from "../dashboard_analysis_header";
import { DashboardAnalysis } from "../../../models/analysis";

const mockAnalysisData: DashboardAnalysis = {
  users: {
    total: 105,
    active: 83,
    inactive: 17,
    blocked: 5,
    writers: 11,
    applyForWriter: 21, // 21/105 = 20%
  },
  subscriptionTypes: {
    free: 53,
    pro: 31,
    premium: 22,
  },
  posts: {
    total: 200,
    published: 173,
    featured: 27,
    perMonth: {
      "January": 37,
      "February": 47,
      "March": 89,
    },
    topics: {
      "Fantasy": 120, // 120/200 = 60%
      "Mystery": 80,  // 80/200 = 40%
    },
  },
};

describe("DashboardAnalysisHeader", () => {

  afterEach(() => {
    cleanup();
  });

  it("renders the header and live data badge", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByRole("heading", { name: "Analysis Overview" })).toBeInTheDocument();
    expect(screen.getByText("Real-time platform metrics and insights")).toBeInTheDocument();
    expect(screen.getByText("Live Data")).toBeInTheDocument();
  });

  it("renders the total users section with active and writers details", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("105")).toBeInTheDocument();
    expect(screen.getAllByText("83").length).toBeGreaterThan(0);  // Active users count
    expect(screen.getByText("11")).toBeInTheDocument();                 // Writers count
  });

  it("renders the total posts section with published and featured details", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Total Posts")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("173")).toBeInTheDocument();                // Published posts count
    expect(screen.getByText("27")).toBeInTheDocument();                 // Featured posts count
  });

  it("renders the subscriptions section with free, pro, and premium details", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Subscriptions")).toBeInTheDocument();
    expect(screen.getByText("106")).toBeInTheDocument();     // totalSubs: 53 + 31 + 22
    expect(screen.getByText("53")).toBeInTheDocument();      // Free
    expect(screen.getByText("31")).toBeInTheDocument();      // Pro
    expect(screen.getByText("22")).toBeInTheDocument();      // Premium
  });

  it("renders the writer applications section with correct percentage", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Writer Applications")).toBeInTheDocument();
    expect(screen.getByText("20.0% of total users")).toBeInTheDocument();
  });

  it("renders the posts per month trend list", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Posts per Month")).toBeInTheDocument();
    expect(screen.getByText("January")).toBeInTheDocument();
    expect(screen.getByText("37")).toBeInTheDocument();
    expect(screen.getByText("February")).toBeInTheDocument();
    expect(screen.getByText("47")).toBeInTheDocument();
    expect(screen.getByText("March")).toBeInTheDocument();
    expect(screen.getByText("89")).toBeInTheDocument();
  });

  it("renders the topics distribution list with correct percentages", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Topics Distribution")).toBeInTheDocument();
    expect(screen.getByText("Fantasy")).toBeInTheDocument();
    expect(screen.getByText("120 posts")).toBeInTheDocument();
    expect(screen.getByText("Mystery")).toBeInTheDocument();
    expect(screen.getByText("80 posts")).toBeInTheDocument();
    
    // Topic percentage checks
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("renders the user status overview cards", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("User Status Overview")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("Inactive Users")).toBeInTheDocument();
    expect(screen.getByText("Blocked Users")).toBeInTheDocument();

    // User counts
    expect(screen.getAllByText("83").length).toBeGreaterThan(0); // Active
    expect(screen.getByText("17")).toBeInTheDocument();                // Inactive
    expect(screen.getByText("5")).toBeInTheDocument();                 // Blocked
  });

  it("renders safely with missing optional data", () => {
    const emptyData: DashboardAnalysis = {};
    render(<DashboardAnalysisHeader data={emptyData} />);

    expect(screen.getByText("Analysis Overview")).toBeInTheDocument();
    expect(screen.getByText("Writer Applications")).toBeInTheDocument();
    expect(screen.getByText("0% of total users")).toBeInTheDocument();
  });
});
