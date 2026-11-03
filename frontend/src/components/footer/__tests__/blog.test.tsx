import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Blog from "../blog";

afterEach(() => {
  cleanup();
});

describe("Blog", () => {
  it("renders the blog page content without JSX structure errors", () => {
    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /explore creative insights/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /latest topics/i,
      })
    ).toBeInTheDocument();

    expect(screen.getAllByRole("link", { name: /read more/i })).toHaveLength(3);

    expect(
      screen.getByRole("link", { name: /back to home/i })
    ).toHaveAttribute("href", "/");
  });
});
