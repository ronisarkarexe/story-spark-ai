import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { WriterApplicationForm } from "../writer_application.form";
import { User } from "../../../../models/user";

// Mock react-router-dom's useBlocker for data router compatibility in tests
vi.mock("react-router-dom", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useBlocker: vi.fn(() => ({
      state: "unblocked",
      proceed: vi.fn(),
      reset: vi.fn(),
    })),
  };
});

// Mock RTK Query hook
vi.mock("../../../../redux/apis/writer_application.api", () => ({
  useSubmitWriterApplicationMutation: () => [vi.fn(), { isLoading: false }],
}));

const baseMockUser: User = {
  _id: "user-1",
  name: "Test User",
  email: "test@example.com",
  role: "reader",
  isApplyForWriter: false,
  isEmailVerified: true,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
} as unknown as User;

describe("WriterApplicationForm Component", () => {
  it("renders the writer application form when isApplyForWriter is false", () => {
    render(
      <MemoryRouter>
        <WriterApplicationForm user={{ ...baseMockUser, isApplyForWriter: false }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Apply for Writer Access")).toBeTruthy();
    expect(screen.getByLabelText(/Portfolio \/ Website URL/i)).toBeTruthy();
    expect(screen.getByLabelText(/Why do you want to write for StorySpark AI\?/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit Application" })).toBeTruthy();
    expect(screen.queryByText("Application Under Review")).toBeNull();
  });

  it("renders the Application Under Review status when isApplyForWriter is true", () => {
    render(
      <MemoryRouter>
        <WriterApplicationForm user={{ ...baseMockUser, isApplyForWriter: true }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Application Under Review")).toBeTruthy();
    expect(
      screen.getByText(/You have already submitted an application for writer access/i)
    ).toBeTruthy();
    expect(screen.queryByText("Apply for Writer Access")).toBeNull();
    expect(screen.queryByRole("button", { name: "Submit Application" })).toBeNull();
  });

  it("renders nothing when user role is already writer", () => {
    const { container } = render(
      <MemoryRouter>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <WriterApplicationForm user={{ ...baseMockUser, role: "writer" as any }} />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when user role is admin", () => {
    const { container } = render(
      <MemoryRouter>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <WriterApplicationForm user={{ ...baseMockUser, role: "admin" as any }} />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});

