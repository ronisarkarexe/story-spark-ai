import { useMemo } from "react";
import { getDialogueDistribution } from "../utils/dialogueDistribution";

export default function useDialogueDistribution(story: string) {
  return useMemo(() => getDialogueDistribution(story), [story]);
}