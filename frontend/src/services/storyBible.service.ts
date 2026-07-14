import { instance as axios } from "../helpers/axios/axiosInstance";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface ICharacter {
  id?: string;
  name: string;
  role: string;
  physicalTraits: string;
  personality: string;
  background: string;
  notes: string;
}

export interface ILocation {
  id?: string;
  name: string;
  description: string;
  history: string;
  notes: string;
}

export interface IObject {
  id?: string;
  name: string;
  description: string;
  significance: string;
  notes: string;
}

export interface IRelationship {
  id?: string;
  character1: string;
  character2: string;
  relationshipType: string;
  dynamics: string;
}

export interface ITimelineEvent {
  id?: string;
  dateOrTime: string;
  description: string;
  charactersInvolved: string[];
}

export interface IStoryBible {
  storyId: string;
  characters: ICharacter[];
  locations: ILocation[];
  objects: IObject[];
  relationships: IRelationship[];
  timelineEvents: ITimelineEvent[];
}

export const getStoryBible = async (storyId: string): Promise<IStoryBible | null> => {
  const response = await axios.get(`${BASE_URL}/story-bible/${storyId}`);
  return response.data.data;
};

export const updateStoryBible = async (storyId: string, payload: Partial<IStoryBible>): Promise<IStoryBible> => {
  const response = await axios.put(`${BASE_URL}/story-bible/${storyId}`, payload);
  return response.data.data;
};

export const extractStoryBible = async (storyId: string): Promise<IStoryBible> => {
  const response = await axios.post(`${BASE_URL}/story-bible/${storyId}/extract`);
  return response.data.data;
};
