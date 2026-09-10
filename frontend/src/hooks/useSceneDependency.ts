import { useMemo } from "react";
import { getSceneDependencies } from "../utils/sceneDependency";

export default function useSceneDependency() {
  return useMemo(() => {
    return getSceneDependencies();
  }, []);
}