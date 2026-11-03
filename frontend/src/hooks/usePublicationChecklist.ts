import { useMemo } from "react";
import { generateChecklist } from "../utils/publicationChecklist";

export default function usePublicationChecklist() {
  return useMemo(() => generateChecklist(), []);
}