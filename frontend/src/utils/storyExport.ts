// Types
export type ExportTheme =
  | "Classic"
  | "Novel"
  | "Minimal"
  | "Dark";

export interface StoryData {
  title: string;
  author: string;
  content: string;
  createdAt: string;
}

// Theme configuration
const themes = {
  Classic: {
    font: "Times New Roman",
    fontSize: 16,
  },
  Novel: {
    font: "Georgia",
    fontSize: 18,
  },
  Minimal: {
    font: "Helvetica",
    fontSize: 14,
  },
  Dark: {
    font: "Courier",
    fontSize: 16,
  },
};

// PDF Export
export const exportAsPDF = (
  story: StoryData,
  theme: ExportTheme
) => {
  // jsPDF implementation
};

// DOCX Export
export const exportAsDOCX = (
  story: StoryData,
  theme: ExportTheme
) => {
  // docx implementation
};