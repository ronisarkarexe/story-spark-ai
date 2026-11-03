import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { StorySegment, UserChoiceProgress, BranchStatistics } from "./story_branching.model";
import {
  IStorySegment,
  IUserChoiceProgress,
  IBranchValidationResult,
  IBranchStatistics,
} from "./story_branching.interface";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

/**
 * Service for managing story branching logic
 */
export class StoryBranchingService {
  /**
   * Create initial branching story with root segment
   */
  static async createBranchingStory(
    storyId: string,
    userId: string,
    initialContent: string,
    choices: Array<{ text: string }>
  ): Promise<IStorySegment> {
    try {
      // Validate story exists in Post collection
      const { Post } = await import("../post/post.model");
      const story = await Post.findById(storyId);
      if (!story) {
        throw new ApiError(httpStatus.NOT_FOUND, "Story not found");
      }

      // Create initial segment
      const branchChoices = choices.map((choice) => ({
        id: uuidv4(),
        text: choice.text,
      }));

      const rootSegment = await StorySegment.create({
        storyId: new Types.ObjectId(storyId),
        parentSegmentId: null,
        content: initialContent,
        choices: branchChoices,
        segmentIndex: 0,
        branchPath: "root",
        branchDepth: 0,
        isLeaf: false,
        createdBy: new Types.ObjectId(userId),
      });

      return rootSegment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create branching story");
    }
  }

  /**
   * Create a new segment branching from parent
   */
  static async createSegment(
    storyId: string,
    parentSegmentId: string,
    userId: string,
    content: string,
    choices: Array<{ text: string }>
  ): Promise<IStorySegment> {
    try {
      const parentSegment = await StorySegment.findById(parentSegmentId);
      if (!parentSegment) {
        throw new ApiError(httpStatus.NOT_FOUND, "Parent segment not found");
      }

      if (parentSegment.storyId.toString() !== storyId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Segment does not belong to this story");
      }

      // Update parent segment to not be a leaf
      parentSegment.isLeaf = false;
      await parentSegment.save();

      // Generate branch path
      const childIndex = parentSegment.choices.length + 1;
      const branchPath = `${parentSegment.branchPath}/${childIndex}`;

      const branchChoices = choices.map((choice) => ({
        id: uuidv4(),
        text: choice.text,
      }));

      const newSegment = await StorySegment.create({
        storyId: new Types.ObjectId(storyId),
        parentSegmentId: new Types.ObjectId(parentSegmentId),
        content,
        choices: branchChoices,
        segmentIndex: parentSegment.segmentIndex + 1,
        branchPath,
        branchDepth: parentSegment.branchDepth + 1,
        isLeaf: true,
        createdBy: new Types.ObjectId(userId),
      });

      // Link parent choice to this segment
      const choiceId = parentSegment.choices[parentSegment.choices.length - 1]?.id || uuidv4();
      parentSegment.choices[parentSegment.choices.length - 1].nextSegmentId = newSegment._id;
      await parentSegment.save();

      return newSegment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create segment");
    }
  }

  /**
   * Get complete branch tree for a story
   */
  static async getBranchTree(storyId: string, maxDepth?: number) {
    try {
      const query: any = { storyId: new Types.ObjectId(storyId) };
      if (maxDepth) {
        query.branchDepth = { $lte: maxDepth };
      }

      const segments = await StorySegment.find(query)
        .populate("parentSegmentId", "content branchPath")
        .sort({ branchPath: 1 });

      if (segments.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No segments found for story");
      }

      // Build tree structure
      const nodeMap = new Map();
      segments.forEach((seg) => {
        nodeMap.set(seg._id.toString(), {
          id: seg._id.toString(),
          parentId: seg.parentSegmentId ? seg.parentSegmentId.toString() : null,
          content: seg.content.substring(0, 200),
          branchPath: seg.branchPath,
          branchDepth: seg.branchDepth,
          choicesCount: seg.choices.length,
          isLeaf: seg.isLeaf,
        });
      });

      // Build edges
      const edges = segments
        .filter((seg) => seg.parentSegmentId !== null && seg.parentSegmentId !== undefined)
        .map((seg) => ({
          source: (seg.parentSegmentId as any).toString(),
          target: seg._id.toString(),
        }));

      return {
        nodes: Array.from(nodeMap.values()),
        edges,
        totalSegments: segments.length,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch branch tree");
    }
  }

  /**
   * Record user choice and update progress
   */
  static async recordUserChoice(
    userId: string,
    storyId: string,
    currentSegmentId: string,
    choiceId: string,
    choiceText: string
  ): Promise<IUserChoiceProgress> {
    try {
      const segment = await StorySegment.findById(currentSegmentId);
      if (!segment || segment.storyId.toString() !== storyId) {
        throw new ApiError(httpStatus.NOT_FOUND, "Segment not found");
      }

      // Verify choice exists
      const choiceExists = segment.choices.some((c) => c.id === choiceId);
      if (!choiceExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid choice");
      }

      // Update or create user progress
      let progress = await UserChoiceProgress.findOne({
        userId: new Types.ObjectId(userId),
        storyId: new Types.ObjectId(storyId),
      });

      if (!progress) {
        progress = new UserChoiceProgress({
          userId: new Types.ObjectId(userId),
          storyId: new Types.ObjectId(storyId),
          currentSegmentId: new Types.ObjectId(currentSegmentId),
          choiceHistory: [],
          isActive: true,
        });
      }

      // Add choice to history
      progress.choiceHistory.push({
        segmentId: new Types.ObjectId(currentSegmentId),
        choiceId,
        choiceText,
        timestamp: new Date(),
      });

      // Update current segment to next segment if available
      const nextChoice = segment.choices.find((c) => c.id === choiceId);
      if (nextChoice?.nextSegmentId) {
        progress.currentSegmentId = nextChoice.nextSegmentId;
      }

      // If segment is leaf, mark as completed
      if (segment.isLeaf && nextChoice && !nextChoice.nextSegmentId) {
        progress.isActive = false;
        progress.completedAt = new Date();
      }

      await progress.save();

      // Update choice statistics
      await this.updateChoiceStatistics(storyId, currentSegmentId, choiceId);

      return progress;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to record choice");
    }
  }

  /**
   * Get user's story progress
   */
  static async getUserProgress(
    userId: string,
    storyId: string
  ): Promise<IUserChoiceProgress | null> {
    try {
      const progress = await UserChoiceProgress.findOne({
        userId: new Types.ObjectId(userId),
        storyId: new Types.ObjectId(storyId),
      }).populate("currentSegmentId", "content choices branchPath");

      return progress;
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch user progress");
    }
  }

  /**
   * Get choice statistics for a story
   */
  static async getChoiceStatistics(storyId: string): Promise<IBranchStatistics[]> {
    try {
      const stats = await BranchStatistics.find({
        storyId: new Types.ObjectId(storyId),
      })
        .populate("segmentId", "branchPath content")
        .sort({ totalSelections: -1 });

      return stats;
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch statistics");
    }
  }

  /**
   * Update choice statistics when user makes a choice
   */
  private static async updateChoiceStatistics(
    storyId: string,
    segmentId: string,
    choiceId: string
  ): Promise<void> {
    try {
      await BranchStatistics.findOneAndUpdate(
        {
          storyId: new Types.ObjectId(storyId),
          segmentId: new Types.ObjectId(segmentId),
          choiceId,
        },
        {
          $inc: { totalSelections: 1 },
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error("Failed to update choice statistics:", error);
      // Non-critical, don't throw
    }
  }

  /**
   * Validate branch integrity - checks for circular references, orphaned segments, etc.
   */
  static async validateBranchIntegrity(storyId: string): Promise<IBranchValidationResult> {
    try {
      const segments = await StorySegment.find({
        storyId: new Types.ObjectId(storyId),
      });

      const errors: string[] = [];
      const warnings: string[] = [];
      let orphanedCount = 0;
      let circularCount = 0;
      let deadEndsCount = 0;

      const segmentIds = new Set(segments.map((s) => s._id.toString()));
      const visited = new Set<string>();
      const recursionStack = new Set<string>();

      // Check for orphaned segments (except root)
      segments.forEach((segment) => {
        if (segment.parentSegmentId && !segmentIds.has(segment.parentSegmentId.toString())) {
          orphanedCount++;
          errors.push(`Orphaned segment: ${segment._id} - parent not found`);
        }
      });

      // Check for circular references using DFS
      const hasCycle = (nodeId: string, stack: Set<string>): boolean => {
        if (stack.has(nodeId)) return true;
        if (visited.has(nodeId)) return false;

        visited.add(nodeId);
        stack.add(nodeId);

        const segment = segments.find((s) => s._id.toString() === nodeId);
        if (segment?.parentSegmentId) {
          if (hasCycle(segment.parentSegmentId.toString(), stack)) {
            circularCount++;
            return true;
          }
        }

        stack.delete(nodeId);
        return false;
      };

      segments.forEach((segment) => {
        if (segment.parentSegmentId && !visited.has(segment._id.toString())) {
          hasCycle(segment._id.toString(), new Set());
        }
      });

      // Count dead ends (leaf segments without choices or unlinked choices)
      segments.forEach((segment) => {
        if (segment.isLeaf && segment.choices.length > 0) {
          const unlinkedChoices = segment.choices.filter((c) => !c.nextSegmentId);
          if (unlinkedChoices.length > 0) {
            deadEndsCount++;
            warnings.push(
              `Segment ${segment._id} has ${unlinkedChoices.length} unlinked choice(s)`
            );
          }
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        stats: {
          totalSegments: segments.length,
          orphanedSegments: orphanedCount,
          circularReferences: circularCount,
          deadEnds: deadEndsCount,
        },
      };
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to validate branch integrity");
    }
  }

  /**
   * Get branch statistics summary
   */
  static async getBranchStatisticsSummary(storyId: string) {
    try {
      const segments = await StorySegment.find({
        storyId: new Types.ObjectId(storyId),
      });

      const stats = await BranchStatistics.find({
        storyId: new Types.ObjectId(storyId),
      });

      const totalSelections = stats.reduce((sum, stat) => sum + stat.totalSelections, 0) || 1;

      const processedStats = stats.map((stat) => ({
        ...stat.toObject(),
        percentageSelected: ((stat.totalSelections / totalSelections) * 100).toFixed(2),
      }));

      const mostPopularChoices = processedStats
        .sort((a, b) => b.totalSelections - a.totalSelections)
        .slice(0, 10);

      return {
        totalSegments: segments.length,
        totalChoices: stats.length,
        totalSelections,
        mostPopularChoices,
        avgSegmentsPerPath:
          segments.length > 0
            ? (segments.reduce((sum, s) => sum + s.branchDepth, 0) / segments.length).toFixed(2)
            : 0,
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to fetch statistics summary"
      );
    }
  }

  /**
   * Delete segment and its children
   */
  static async deleteSegment(segmentId: string, userId: string): Promise<void> {
    try {
      const segment = await StorySegment.findById(segmentId);
      if (!segment) {
        throw new ApiError(httpStatus.NOT_FOUND, "Segment not found");
      }

      // Only creator or admin can delete
      if (segment.createdBy.toString() !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "Cannot delete segment created by another user");
      }

      // Recursively find and delete children
      const childSegments = await StorySegment.find({
        parentSegmentId: segment._id,
      });

      for (const child of childSegments) {
        await this.deleteSegment(child._id.toString(), userId);
      }

      // Delete segment
      await StorySegment.findByIdAndDelete(segmentId);

      // Update parent segment if it has no more children
      if (segment.parentSegmentId) {
        const siblings = await StorySegment.findOne({
          parentSegmentId: segment.parentSegmentId,
        });

        if (!siblings) {
          await StorySegment.findByIdAndUpdate(segment.parentSegmentId, { isLeaf: true });
        }
      }

      // Delete associated statistics
      await BranchStatistics.deleteMany({
        segmentId: new Types.ObjectId(segmentId),
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to delete segment");
    }
  }
}
