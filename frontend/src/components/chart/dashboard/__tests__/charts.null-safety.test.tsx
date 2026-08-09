// @vitest-environment jsdom
/**
 * Regression tests for issue #937: the Explore/Dashboard page crashed with
 * "Cannot read properties of undefined (reading 'total')" because the admin
 * dashboard passed possibly-undefined sub-objects (data.users!,
 * data.subscriptionTypes!, data.posts!.perMonth, data.posts!.topics) into the
 * chart components, which then dereferenced them.
 *
 * These tests assert the chart components themselves are null-safe: rendering
 * them with undefined / empty props must not throw.
 */
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// react-chartjs-2 renders to a <canvas>; jsdom has no canvas impl, so stub the
// chart components. We only care that our wrappers don't throw on bad input.
vi.mock("react-chartjs-2", () => ({
  Pie: () => <div data-testid="pie" />,
  Doughnut: () => <div data-testid="doughnut" />,
  Bar: () => <div data-testid="bar" />,
  Line: () => <div data-testid="line" />,
}));
vi.mock("chart.js", () => ({
  Chart: { register: () => {} },
  ArcElement: {},
  Tooltip: {},
  Legend: {},
  Title: {},
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  PointElement: {},
  LineElement: {},
}));

import UsersPieChart from "../pai_chart";
import SubscriptionChart from "../doughnut_chart";
import TopicsChart from "../bar_chart";
import PostsPerMonthChart from "../line_chart";

describe("#937 - chart components are null-safe", () => {
  it("UsersPieChart renders without throwing when data is undefined", () => {
    expect(() => render(<UsersPieChart data={undefined as never} />)).not.toThrow();
  });

  it("UsersPieChart renders with a populated users object", () => {
    const { getByTestId } = render(
      <UsersPieChart
        data={{
          total: 10,
          active: 5,
          inactive: 3,
          blocked: 1,
          writers: 1,
          applyForWriter: 0,
        }}
      />
    );
    expect(getByTestId("pie")).toBeTruthy();
  });

  it("SubscriptionChart renders without throwing when data is undefined", () => {
    expect(() => render(<SubscriptionChart data={undefined as never} />)).not.toThrow();
  });

  it("TopicsChart renders without throwing when topics is undefined", () => {
    expect(() => render(<TopicsChart topics={undefined as never} />)).not.toThrow();
  });

  it("TopicsChart renders with topic data", () => {
    const { getByTestId } = render(<TopicsChart topics={{ fiction: 4, drama: 2 }} />);
    expect(getByTestId("bar")).toBeTruthy();
  });

  it("PostsPerMonthChart renders without throwing when perMonth is undefined", () => {
    expect(() => render(<PostsPerMonthChart perMonth={undefined as never} />)).not.toThrow();
  });

  it("PostsPerMonthChart renders with an empty object", () => {
    const { getByTestId } = render(<PostsPerMonthChart perMonth={{}} />);
    expect(getByTestId("line")).toBeTruthy();
  });
});
