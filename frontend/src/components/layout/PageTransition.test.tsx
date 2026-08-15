import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import PageTransition, { pageVariants } from "./PageTransition";

let mockReducedMotion = false;
let capturedMotionProps: Record<string, any> = {};

// Mock framer-motion to capture props and control reduced motion in tests
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => mockReducedMotion,
    motion: {
      ...actual.motion,
      div: ({ children, className, ...props }: any) => {
        capturedMotionProps = props;
        return (
          <div className={className} data-testid="motion-div">
            {children}
          </div>
        );
      },
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe("PageTransition Component", () => {
  beforeEach(() => {
    mockReducedMotion = false;
    capturedMotionProps = {};
  });

  it("renders children successfully within the router context", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <PageTransition>
          <div data-testid="test-content">Page Content</div>
        </PageTransition>
      </MemoryRouter>
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Page Content")).toBeInTheDocument();
  });

  it("applies custom className to wrapper element", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/custom-route"]}>
        <PageTransition className="custom-class-name">
          <div>Child Content</div>
        </PageTransition>
      </MemoryRouter>
    );

    const animatedWrapper = container.firstElementChild;
    expect(animatedWrapper).toHaveClass("custom-class-name");
  });

  it("applies standard transition duration and initial state when reduced motion is disabled", () => {
    mockReducedMotion = false;

    render(
      <MemoryRouter initialEntries={["/standard"]}>
        <PageTransition>
          <div>Standard Content</div>
        </PageTransition>
      </MemoryRouter>
    );

    expect(capturedMotionProps.initial).toBe("initial");
    expect(capturedMotionProps.custom).toBe(false);
    expect(capturedMotionProps.transition?.duration).toBe(0.22);

    const initialVariant = pageVariants.initial(false);
    expect(initialVariant.opacity).toBe(0);
    expect(initialVariant.y).toBe(8);
  });

  it("bypasses motion and sets duration to 0 with fully visible initial state when reduced motion is enabled", () => {
    mockReducedMotion = true;

    render(
      <MemoryRouter initialEntries={["/reduced-motion"]}>
        <PageTransition>
          <div>Accessible Content</div>
        </PageTransition>
      </MemoryRouter>
    );

    expect(capturedMotionProps.initial).toBe(false);
    expect(capturedMotionProps.custom).toBe(true);
    expect(capturedMotionProps.transition?.duration).toBe(0);

    const initialVariant = pageVariants.initial(true);
    expect(initialVariant.opacity).toBe(1);
    expect(initialVariant.y).toBe(0);

    const exitVariant = pageVariants.exit(true);
    expect(exitVariant.opacity).toBe(1);
    expect(exitVariant.y).toBe(0);
  });
});
