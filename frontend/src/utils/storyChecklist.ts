export interface StoryData {
  title: string;
  content: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

const CHARACTER_REGEX = /(hero|character|name|friend|villain)/i;
const SETTING_REGEX = /(city|forest|village|school|home|castle|mountain)/i;
const CONFLICT_REGEX = /(problem|fight|enemy|challenge|conflict|danger)/i;
const CLIMAX_REGEX = /(finally|battle|climax|last chance)/i;
const CONCLUSION_REGEX = /(ended|happy ending|conclusion|finally|the end)/i;

export const hasTitle = (story: StoryData) => {
  return story.title.trim().length > 0;
};

export const hasCharacters = (story: StoryData) => {
  return CHARACTER_REGEX.test(story.content);
};

export const hasSetting = (story: StoryData) => {
  return SETTING_REGEX.test(story.content);
};

export const hasConflict = (story: StoryData) => {
  return CONFLICT_REGEX.test(story.content);
};

export const hasClimax = (story: StoryData) => {
  return CLIMAX_REGEX.test(story.content);
};

export const hasConclusion = (story: StoryData) => {
  return CONCLUSION_REGEX.test(story.content);
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