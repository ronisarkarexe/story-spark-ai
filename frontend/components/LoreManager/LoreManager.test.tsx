import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { LoreManager } from "./LoreManager";

describe("LoreManager Component", () => {
  it("renders Lorebook Manager title and initial lore cards", () => {
    render(<LoreManager />);

    expect(screen.getByText(/Lorebook Manager/i)).toBeInTheDocument();
    expect(screen.getByTestId("lore-search-input")).toBeInTheDocument();

    // Check pre-populated entries
    expect(screen.getByText("Hogwarts")).toBeInTheDocument();
    expect(screen.getByText("Shadow Magic")).toBeInTheDocument();
  });

  it("opens add entry modal and creates a new lore entry", async () => {
    render(<LoreManager />);

    const addBtn = screen.getByTestId("add-entry-btn");
    fireEvent.click(addBtn);

    expect(screen.getByTestId("lore-modal")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("entry-key-input"), {
      target: { value: "Azkaban" },
    });
    fireEvent.change(screen.getByTestId("entry-content-input"), {
      target: { value: "A fortress prison guarded by Dementors." },
    });

    const saveBtn = screen.getByTestId("save-entry-btn");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText("Azkaban")).toBeInTheDocument();
      expect(screen.getByText("A fortress prison guarded by Dementors.")).toBeInTheDocument();
    });
  });

  it("filters entries by search query", () => {
    render(<LoreManager />);

    const searchInput = screen.getByTestId("lore-search-input");
    fireEvent.change(searchInput, { target: { value: "Hogwarts" } });

    expect(screen.getByText("Hogwarts")).toBeInTheDocument();
    expect(screen.queryByText("Law of Equivalence")).not.toBeInTheDocument();
  });

  it("detects keywords and injects context into live prompt simulator preview", () => {
    render(<LoreManager />);

    const promptInput = screen.getByTestId("simulator-prompt-input");
    fireEvent.change(promptInput, {
      target: { value: "A dark wizard attacked Hogwarts using Shadow Magic." },
    });

    const preview = screen.getByTestId("system-prompt-preview");
    expect(preview.textContent).toContain("Hogwarts");
    expect(preview.textContent).toContain("Shadow Magic");
    expect(preview.textContent).toContain("[WORLD LORE & RULES - STRICT ADHERENCE REQUIRED]");
  });

  it("runs simulator test generation", () => {
    render(<LoreManager />);

    const runBtn = screen.getByTestId("run-simulator-btn");
    fireEvent.click(runBtn);

    expect(screen.getByText(/Dynamic Context Injector Activated/i)).toBeInTheDocument();
  });
});
