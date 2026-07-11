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

export const createNode = (...) => {};

export const addChoice = (...) => {};

export const removeChoice = (...) => {};

export const updateChoice = (...) => {};

export const deleteNode = (...) => {};

export const validateStoryTree = (...) => {};