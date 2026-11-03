export interface CallbackItem {
  id: number;
  element: string;
  firstAppearance: string;
  callback: string;
  suggestion: string;
}

export const getCallbacks = (): CallbackItem[] => {
  return [
    {
      id: 1,
      element: "Silver Necklace",
      firstAppearance: "Chapter 1",
      callback: "Chapter 8",
      suggestion: "Mention its emotional value before the final reveal.",
    },
    {
      id: 2,
      element: "Old Letter",
      firstAppearance: "Chapter 2",
      callback: "Chapter 10",
      suggestion: "Reference the letter once more in the middle chapters.",
    },
    {
      id: 3,
      element: "Broken Watch",
      firstAppearance: "Chapter 3",
      callback: "Chapter 9",
      suggestion: "Use the watch as a recurring symbol.",
    },
  ];
};