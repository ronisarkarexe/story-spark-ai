export interface StoryChoice {
  id: string;
  text: string;
  nextNodeId: string;
}

export interface StoryNode {
  id: string;
  title: string;
  content: string;
  choices: StoryChoice[];
}

export const createNode = (): StoryNode => {
  throw new Error("Not implemented.");
};

export const addChoice = (): void => {
  throw new Error("Not implemented.");
};

export const removeChoice = (): void => {
  throw new Error("Not implemented.");
};

export const updateChoice = (): void => {
  throw new Error("Not implemented.");
};

export const deleteNode = (): void => {
  throw new Error("Not implemented.");
};

export const validateStoryTree = (): boolean => {
  throw new Error("Not implemented.");
};