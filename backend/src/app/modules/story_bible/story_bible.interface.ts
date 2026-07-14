import { Types } from "mongoose";

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
  storyId: Types.ObjectId | string;
  characters: ICharacter[];
  locations: ILocation[];
  objects: IObject[];
  relationships: IRelationship[];
  timelineEvents: ITimelineEvent[];
  createdAt?: Date;
  updatedAt?: Date;
}
