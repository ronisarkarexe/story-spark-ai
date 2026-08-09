import { useEffect, useState } from "react";
import {
  getRecoveredDraft,
  discardRecoveredDraft,
  formatSavedTime,
} from "../../utils/storySessionRecovery";

interface Props {
  story: string;
  onRestore?: (story: string) => void;
}

export default function StorySessionRecovery({
  story,
  onRestore,
}: Props) {
  const [draft, setDraft] = useState(getRecoveredDraft());

  useEffect(() => {
    setDraft(getRecoveredDraft());
  }, []);

  if (!draft) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded-xl p-6 mb-6">

      <h2 className="text-xl font-bold">
        💾 Recovered Draft Available
      </h2>

      <p className="mt-2">
        Last Auto Save:
        <strong> {formatSavedTime(draft.savedAt)}</strong>
      </p>

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => onRestore?.(draft.content)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Restore Draft
        </button>

        <button
          onClick={() => {
            discardRecoveredDraft();
            setDraft(null);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Discard
        </button>

      </div>

    </div>
  );
}