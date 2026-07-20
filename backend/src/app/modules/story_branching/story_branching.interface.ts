import { Model, Types } from "mongoose";

/**
 * Represents a choice/decision point in a branching story
 */
export interface IBranchChoice {
  id: string;
  text: string;
  nextSegmentId?: Types.ObjectId;
}

/**
 * Represents a single story segment in a branching narrative
 */
export interface IStorySegment {
  _id?: Types.ObjectId;
  storyId: Types.ObjectId;
  parentSegmentId?: Types.ObjectId | null;
  content: string;
  choices: IBranchChoice[];
  segmentIndex: number;
  branchPath: string; // e.g., "main/0/1/2" or "path-name/choice-2"
  branchDepth: number;
  isLeaf: boolean;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents user's choice progression through a story
 */
export interface IUserChoiceProgress {
  userId: Types.ObjectId;
  storyId: Types.ObjectId;
  currentSegmentId: Types.ObjectId;
  choiceHistory: Array<{
    segmentId: Types.ObjectId;
    choiceId: string;
    choiceText: string;
    timestamp: Date;
  }>;
  completedAt?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Statistics about branch usage and popularity
 */
export interface IBranchStatistics {
  storyId: Types.ObjectId;
  segmentId: Types.ObjectId;
  choiceId: string;
  totalSelections: number;
  percentageSelected: number;
  avgTimeSpent?: number; // in seconds
  updatedAt?: Date;
}

/**
 * Represents branch integrity validation result
 */
export interface IBranchValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalSegments: number;
    orphanedSegments: number;
    circularReferences: number;
    deadEnds: number;
  };
}

export type StorySegmentModel = Model<IStorySegment, object>;
export type UserChoiceProgressModel = Model<IUserChoiceProgress, object>;
export type BranchStatisticsModel = Model<IBranchStatistics, object>;
