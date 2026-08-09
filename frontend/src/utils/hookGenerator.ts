export interface StoryHook {
  style: string;
  hook: string;
}

export function generateHooks(title: string): StoryHook[] {
  return [
    {
      style: "Mystery",
      hook: `Nobody expected "${title}" to begin with a locked door that had never been opened.`,
    },
    {
      style: "Action",
      hook: `The first explosion changed everything before anyone knew what was happening in "${title}".`,
    },
    {
      style: "Emotion",
      hook: `On the day everything fell apart, one forgotten letter changed the fate of "${title}".`,
    },
    {
      style: "Humor",
      hook: `It all started because someone accidentally adopted a dragon instead of a puppy.`,
    },
    {
      style: "Suspense",
      hook: `Every midnight, someone knocked on the door—but nobody was ever there.`,
    },
  ];
}