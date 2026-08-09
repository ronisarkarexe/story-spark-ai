import { useState } from "react";
import { createRevision } from "../utils/revisionTimeline";
import { Revision } from "../types/revision";

export default function useRevisionTimeline() {
  const [revisions, setRevisions] = useState<Revision[]>([]);

  const saveRevision = (content: string) => {
    setRevisions((prev) => [createRevision(content), ...prev]);
  };

  return { revisions, saveRevision };
}