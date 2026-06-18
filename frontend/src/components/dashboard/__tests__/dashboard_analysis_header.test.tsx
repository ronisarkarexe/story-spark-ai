// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
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
  beforeEach(() => {
    // any setup if needed
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the header and live data badge", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByRole("heading", { name: "Analysis Overview" })).toBeDefined();
    expect(screen.getByText("Real-time platform metrics and insights")).toBeDefined();
    expect(screen.getByText("Live Data")).toBeDefined();
  });

  it("renders the total users section with active and writers details", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Total Users")).toBeDefined();
    expect(screen.getByText("105")).toBeDefined();
    expect(screen.getAllByText("83").length).toBeGreaterThan(0);  // Active users count
    expect(screen.getByText("11")).toBeDefined();                 // Writers count
  });

  it("renders the total posts section with published and featured details", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Total Posts")).toBeDefined();
    expect(screen.getByText("200")).toBeDefined();
    expect(screen.getByText("173")).toBeDefined();                // Published posts count
    expect(screen.getByText("27")).toBeDefined();                 // Featured posts count
  });

  it("renders the subscriptions section with free, pro, and premium details", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Subscriptions")).toBeDefined();
    expect(screen.getByText("106")).toBeDefined();     // totalSubs: 53 + 31 + 22
    expect(screen.getByText("53")).toBeDefined();      // Free
    expect(screen.getByText("31")).toBeDefined();      // Pro
    expect(screen.getByText("22")).toBeDefined();      // Premium
  });

  it("renders the writer applications section with correct percentage", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Writer Applications")).toBeDefined();
    expect(screen.getByText("20.0% of total users")).toBeDefined();
  });

  it("renders the posts per month trend list", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Posts per Month")).toBeDefined();
    expect(screen.getByText("January")).toBeDefined();
    expect(screen.getByText("37")).toBeDefined();
    expect(screen.getByText("February")).toBeDefined();
    expect(screen.getByText("47")).toBeDefined();
    expect(screen.getByText("March")).toBeDefined();
    expect(screen.getByText("89")).toBeDefined();
  });

  it("renders the topics distribution list with correct percentages", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("Topics Distribution")).toBeDefined();
    expect(screen.getByText("Fantasy")).toBeDefined();
    expect(screen.getByText("120 posts")).toBeDefined();
    expect(screen.getByText("Mystery")).toBeDefined();
    expect(screen.getByText("80 posts")).toBeDefined();
    
    // Topic percentage checks
    expect(screen.getByText("60%")).toBeDefined();
    expect(screen.getByText("40%")).toBeDefined();
  });

  it("renders the user status overview cards", () => {
    render(<DashboardAnalysisHeader data={mockAnalysisData} />);

    expect(screen.getByText("User Status Overview")).toBeDefined();
    expect(screen.getByText("Active Users")).toBeDefined();
    expect(screen.getByText("Inactive Users")).toBeDefined();
    expect(screen.getByText("Blocked Users")).toBeDefined();

    // User counts
    expect(screen.getAllByText("83").length).toBeGreaterThan(0); // Active
    expect(screen.getByText("17")).toBeDefined();                // Inactive
    expect(screen.getByText("5")).toBeDefined();                 // Blocked
  });
});
