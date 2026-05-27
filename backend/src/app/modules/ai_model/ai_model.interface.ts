export interface IAIModel {
  prompt: string;
  wordLength: number;
  numStories: number;
  language?: string;
}

export interface IStory {
  title: string;
  content: string;
  tag: string;
  imageURL?: string;
  language?: string;
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

  language?: string;

}

