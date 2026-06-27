export const generateTitleSuggestions = (
  content: string,
  tag: string
): string[] => {
  const keywords = tag || "Story";

  return [
    `The Hidden ${keywords}`,
    `${keywords} Beyond Time`,
    `The Last ${keywords}`,
    `Echoes of ${keywords}`,
    `A Journey Through ${keywords}`,
  ];
};