import { useMemo } from "react";
import { getGenreRecommendations } from "../utils/genreRecommendation";

export default function useGenreRecommendation() {
  return useMemo(() => getGenreRecommendations(), []);
}