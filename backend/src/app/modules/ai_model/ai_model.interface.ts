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

export type RemixType = "setting" | "perspective" | "time_period" | "tone" | "gender_swap";

export interface IRemixPayload {
  title: string;
  content: string;
  tag: string;
  remixType: RemixType;
  remixOption?: string;
  language?: string;
}

export interface IAlternateEndingPayload {
  title: string;
  content: string;
  tag: string;

  language?: string;

}

