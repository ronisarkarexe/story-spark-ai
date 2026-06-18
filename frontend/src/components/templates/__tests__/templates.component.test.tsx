// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import TemplatesComponent from "../templates.component";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock ImageFallback
vi.mock("../../ImageFallback", () => ({
  default: ({ src, alt, className }: { src?: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} data-testid="mock-image" />
  ),
}));

describe("TemplatesComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the page title and description", () => {
    render(<TemplatesComponent />);
    
    expect(screen.getByText("Writing Templates")).toBeDefined();
    expect(
      screen.getByText(
        "Skip the blank page. Choose from beautifully crafted templates for stories, poems, characters, and creative inspiration."
      )
    ).toBeDefined();
  });

  it("renders all template sections", () => {
    render(<TemplatesComponent />);

    expect(screen.getByRole("heading", { name: "Story Writing" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Creative Writing" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Writing Inspiration" })).toBeDefined();
  });

  it("renders individual template cards with their details", () => {
    render(<TemplatesComponent />);

    // Check for some story template cards
    expect(screen.getByText("Fantasy Story")).toBeDefined();
    expect(screen.getByText("Mystery Story")).toBeDefined();
    expect(screen.getByText("Romance Story")).toBeDefined();

    // Check for some creative template cards
    expect(screen.getByText("Character Backstory")).toBeDefined();
    expect(screen.getByText("Dialogue Starter")).toBeDefined();

    // Check for some inspiration cards
    expect(screen.getByText("Story Prompt Generator")).toBeDefined();
  });

  it("navigates to /stories with prompt state when a template is selected", () => {
    render(<TemplatesComponent />);

    const useTemplateButtons = screen.getAllByRole("button", { name: /use template/i });
    expect(useTemplateButtons.length).toBeGreaterThan(0);

    // Click on the first one (Fantasy Story)
    fireEvent.click(useTemplateButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/stories", {
      state: {
        prompt: "Write a fantasy story about a magical kingdom, hidden secrets, and an unexpected hero.",
      },
    });
  });

  it("navigates back to home when Back to Home is clicked", () => {
    render(<TemplatesComponent />);

    const backButton = screen.getByRole("button", { name: /back to home/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to /stories when Start Writing CTA is clicked", () => {
    render(<TemplatesComponent />);

    const startWritingButton = screen.getByRole("button", { name: /start writing/i });
    fireEvent.click(startWritingButton);

    expect(mockNavigate).toHaveBeenCalledWith("/stories");
  });
});
