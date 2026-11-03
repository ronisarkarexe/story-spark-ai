export interface StoryData {
  title: string;
  content: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export const hasTitle = (story: StoryData) => {
  return story.title.trim().length > 0;
};

export const hasCharacters = (story: StoryData) => {
  return /(hero|character|name|friend|villain)/i.test(story.content);
};

export const hasSetting = (story: StoryData) => {
  return /(city|forest|village|school|home|castle|mountain)/i.test(
    story.content
  );
};

export const hasConflict = (story: StoryData) => {
  return /(problem|fight|enemy|challenge|conflict|danger)/i.test(
    story.content
  );
};

export const hasClimax = (story: StoryData) => {
  return /(finally|battle|climax|last chance)/i.test(story.content);
};

export const hasConclusion = (story: StoryData) => {
  return /(ended|happy ending|conclusion|finally|the end)/i.test(
    story.content
  );
};

export const generateChecklist = (
  story: StoryData
): ChecklistItem[] => [
  {
    id: "title",
    label: "Story Title",
    completed: hasTitle(story),
  },
  {
    id: "characters",
    label: "Characters",
    completed: hasCharacters(story),
  },
  {
    id: "setting",
    label: "Setting",
    completed: hasSetting(story),
  },
  {
    id: "conflict",
    label: "Conflict",
    completed: hasConflict(story),
  },
  {
    id: "climax",
    label: "Climax",
    completed: hasClimax(story),
  },
  {
    id: "conclusion",
    label: "Conclusion",
    completed: hasConclusion(story),
  },
];