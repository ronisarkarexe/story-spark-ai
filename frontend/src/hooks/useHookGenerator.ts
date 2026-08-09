import { useMemo } from "react";
import { generateHooks } from "../utils/hookGenerator";

export default function useHookGenerator(title: string) {
  return useMemo(() => {
    return generateHooks(title);
  }, [title]);
}