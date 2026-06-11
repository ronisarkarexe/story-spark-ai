import axios from "axios";
import { getBaseUrl } from "../helpers/config";

const API_BASE = getBaseUrl();

export interface IVocabularyItem {
  word: string;
  definition: string;
  example?: string;
}

export interface IThemeItem {
  theme: string;
  explanation: string;
}

export interface IReadingLevel {
  gradeLevel: string;
  ageRange: string;
  explanation: string;
}

export interface IEducationalInsights {
  vocabulary: IVocabularyItem[];
  comprehensionQuestions: string[];
  discussionQuestions: string[];
  themes: IThemeItem[];
  moralLessons: string[];
  writingPrompts: string[];
  readingLevel: IReadingLevel;
}

export const getEducationalInsights = async (
  storyId: string
): Promise<IEducationalInsights> => {
  const response = await axios.post(
    `${API_BASE}/stories/${storyId}/educational-insights`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data.data;
};
