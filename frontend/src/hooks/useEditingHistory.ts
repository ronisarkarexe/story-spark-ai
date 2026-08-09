import { useMemo } from "react";
import { getSuggestionHistory } from "../utils/editingHistory";

export default function useEditingHistory() {
  return useMemo(() => getSuggestionHistory(), []);
}