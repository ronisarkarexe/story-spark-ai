import { useState } from "react";
import {
  StoryMetadata,
  defaultMetadata,
} from "../utils/storyMetadata";

export default function useStoryMetadata() {
  const [metadata, setMetadata] =
    useState<StoryMetadata>(defaultMetadata);

  const updateField = (
    field: keyof StoryMetadata,
    value: string
  ) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    metadata,
    updateField,
  };
}