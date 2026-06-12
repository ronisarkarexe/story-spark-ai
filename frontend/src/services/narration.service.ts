import axios from "axios";
import { getBaseUrl } from "../helpers/config";

const API_BASE = getBaseUrl();

export interface IVoice {
  voiceId: string;
  name: string;
  category: string;
  description?: string;
  previewUrl?: string;
}

export const getVoices = async (): Promise<IVoice[]> => {
  const response = await axios.get(`${API_BASE}/narration/voices`, {
    withCredentials: true,
  });
  return response.data.data;
};

export const synthesizeTTS = async (
  text: string,
  voiceId: string,
  storyId: string,
  chapterId: string
): Promise<{ audioUrl: string; filename: string }> => {
  const response = await axios.post(
    `${API_BASE}/narration/synthesize`,
    {
      text,
      voiceId,
      storyId,
      chapterId,
    },
    {
      withCredentials: true,
    }
  );
  return response.data.data;
};
