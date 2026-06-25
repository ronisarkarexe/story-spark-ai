import { Model, Types } from "mongoose";
export interface IStoryVersion {
  storyId: Types.ObjectId;
  content: string;
  title: string;
  prompt?: string;
  generationType: string; // e.g., 'initial', 'regenerated', 'edited', 'alternate-ending', 'restored'
  versionNumber: number;
  createdBy: Types.ObjectId;
  
  /*** Branching metadata*/
  parentVersionId?: Types.ObjectId | null;
  branchName?: string | null;
  branchDepth?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StoryVersionModel = Model<IStoryVersion, object>;