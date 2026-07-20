import { model, Schema } from "mongoose";
import {
  IStorySegment,
  IUserChoiceProgress,
  IBranchStatistics,
  StorySegmentModel,
  UserChoiceProgressModel,
  BranchStatisticsModel,
} from "./story_branching.interface";

/**
 * StorySegment Schema - Represents each segment in a branching story
 */
export const StorySegmentSchema = new Schema<IStorySegment, StorySegmentModel>(
  {
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentSegmentId: {
      type: Schema.Types.ObjectId,
      ref: "StorySegment",
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
    choices: [
      {
        id: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        nextSegmentId: {
          type: Schema.Types.ObjectId,
          ref: "StorySegment",
        },
      },
    ],
    segmentIndex: {
      type: Number,
      required: true,
    },
    branchPath: {
      type: String,
      required: true,
    },
    branchDepth: {
      type: Number,
      default: 0,
      min: 0,
    },
    isLeaf: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
StorySegmentSchema.index({ storyId: 1, parentSegmentId: 1 });
StorySegmentSchema.index({ storyId: 1, branchPath: 1 }, { unique: true });
StorySegmentSchema.index({ storyId: 1, segmentIndex: 1 });
StorySegmentSchema.index({ storyId: 1, branchDepth: 1 });

/**
 * UserChoiceProgress Schema - Tracks user's journey through branching stories
 */
export const UserChoiceProgressSchema = new Schema<IUserChoiceProgress, UserChoiceProgressModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    currentSegmentId: {
      type: Schema.Types.ObjectId,
      ref: "StorySegment",
      required: true,
    },
    choiceHistory: [
      {
        segmentId: {
          type: Schema.Types.ObjectId,
          ref: "StorySegment",
          required: true,
        },
        choiceId: {
          type: String,
          required: true,
        },
        choiceText: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    completedAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for user journey tracking
UserChoiceProgressSchema.index({ userId: 1, storyId: 1 }, { unique: true });
UserChoiceProgressSchema.index({ userId: 1, isActive: 1 });
UserChoiceProgressSchema.index({ storyId: 1, isActive: 1 });

/**
 * BranchStatistics Schema - Tracks popular choices and user behavior
 */
export const BranchStatisticsSchema = new Schema<IBranchStatistics, BranchStatisticsModel>(
  {
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    segmentId: {
      type: Schema.Types.ObjectId,
      ref: "StorySegment",
      required: true,
    },
    choiceId: {
      type: String,
      required: true,
    },
    totalSelections: {
      type: Number,
      default: 0,
      min: 0,
    },
    percentageSelected: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    avgTimeSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for statistics queries
BranchStatisticsSchema.index({ storyId: 1, segmentId: 1, choiceId: 1 }, { unique: true });
BranchStatisticsSchema.index({ storyId: 1, totalSelections: -1 });

/**
 * Export models
 */
export const StorySegment = model<IStorySegment, StorySegmentModel>(
  "StorySegment",
  StorySegmentSchema
);

export const UserChoiceProgress = model<IUserChoiceProgress, UserChoiceProgressModel>(
  "UserChoiceProgress",
  UserChoiceProgressSchema
);

export const BranchStatistics = model<IBranchStatistics, BranchStatisticsModel>(
  "BranchStatistics",
  BranchStatisticsSchema
);
