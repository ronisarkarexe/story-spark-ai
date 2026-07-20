import { useState } from "react";
import {
  exportAsPDF,
  exportAsDOCX,
  ExportTheme,
  StoryData,
} from "../../utils/storyExport";

interface ExportStoryModalProps {
  story: StoryData;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportStoryModal({
  story,
  isOpen,
  onClose,
}: ExportStoryModalProps) {
  const [theme, setTheme] = useState<ExportTheme>("Classic");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">
          Export Story
        </h2>

        <label className="mb-2 block font-medium">
          Choose Theme
        </label>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as ExportTheme)}
          className="mb-6 w-full rounded border p-2"
        >
          <option value="Classic">Classic</option>
          <option value="Novel">Novel</option>
          <option value="Minimal">Minimal</option>
          <option value="Dark">Dark</option>
        </select>

        <div className="flex gap-3">
          <button
            onClick={() => exportAsPDF(story, theme)}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Export PDF
          </button>

          <button
            onClick={() => exportAsDOCX(story, theme)}
            className="rounded bg-green-600 px-4 py-2 text-white"
          >
            Export DOCX
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded border px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}