import { useState } from "react";
import api from "../services/api";
import { downloadBlob } from "../utils/story-export.utils";
import logger from "../utils/logger.util";

interface StoryExportModalProps {
  storyId: string;
  storyTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = "epub" | "html";

const StoryExportModal = ({
  storyId,
  storyTitle,
  isOpen,
  onClose,
}: StoryExportModalProps) => {
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const safeTitle = (storyTitle || "story")
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase() || "story";

  const handleExport = async (format: ExportFormat) => {
    setExportingFormat(format);
    setError(null);
    try {
      const response = await api.get(`/story/${storyId}/export`, {
        params: { format },
        responseType: "blob",
      });
      const extension = format === "epub" ? "epub" : "html";
      downloadBlob(response.data, `${safeTitle}.${extension}`);
      onClose();
    } catch (err) {
      logger.error("Story export failed:", err);
      setError("Export failed. Please try again.");
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Export Story</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-5">
          Export "{storyTitle}" for offline reading or sharing.
        </p>

        {error && (
          <p className="text-sm text-rose-400 mb-4" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleExport("epub")}
            disabled={exportingFormat !== null}
            className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-left text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
          >
            <span>
              <span className="block font-semibold">📚 EPUB Ebook</span>
              <span className="block text-xs text-slate-400">
                Read in Kindle, Apple Books, or any e-reader
              </span>
            </span>
            {exportingFormat === "epub" && (
              <span className="text-xs text-slate-400">Exporting…</span>
            )}
          </button>

          <button
            onClick={() => handleExport("html")}
            disabled={exportingFormat !== null}
            className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-left text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
          >
            <span>
              <span className="block font-semibold">🌐 Interactive HTML</span>
              <span className="block text-xs text-slate-400">
                Self-contained file, navigate branches offline in any browser
              </span>
            </span>
            {exportingFormat === "html" && (
              <span className="text-xs text-slate-400">Exporting…</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryExportModal;