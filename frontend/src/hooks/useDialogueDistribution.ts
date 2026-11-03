import { useMemo } from "react";
import { getDialogueDistribution } from "../utils/dialogueDistribution";

export default function useDialogueDistribution() {
  return useMemo(() => getDialogueDistribution(), []);
}