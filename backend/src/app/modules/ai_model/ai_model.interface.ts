export interface IAIModel {
  prompt: string;
  wordLength: number;
  numStories: number
}

export interface IStory {
  title: string;
  content: string;
  tag: string;
  imageURL?: string;
}

export interface IAlternateEnding {
  style: string;
  ending: string;
  fullStory: string;
}

export interface IAlternateEndingPayload {
  title: string;
  content: string;
  tag: string;
}

