import { useState } from "react";

export default function usePreviewMode() {
  const [preview, setPreview] = useState(false);

  const togglePreview = () => {
    setPreview((prev) => !prev);
  };

  return {
    preview,
    togglePreview,
  };
}