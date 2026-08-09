import { useMemo } from "react";
import { analyzeFoilCharacters } from "../utils/foilCharacterAnalyzer";

export default function useFoilCharacterAnalyzer() {
  const pairs = useMemo(() => analyzeFoilCharacters(), []);

  return {
    pairs,
    totalCharacters: pairs.length * 2,
  };
}