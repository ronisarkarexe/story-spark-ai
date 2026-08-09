import axios from "axios";
import { API_BASE_URL } from "./api";

const BASE_URL = `${API_BASE_URL}/story-branches`;

export interface BranchChoice {
  id: string;
  text: string;
  nextSegmentId?: string;
}

export interface StorySegment {
  _id: string;
  storyId: string;
  parentSegmentId?: string | null;
  content: string;
  choices: BranchChoice[];
  segmentIndex: number;
  branchPath: string;
  branchDepth: number;
  isLeaf: boolean;
  createdBy: string;
}

export interface UserChoiceProgress {
  userId: string;
  storyId: string;
  currentSegmentId: string;
  choiceHistory: Array<{
    segmentId: string;
    choiceId: string;
    choiceText: string;
    timestamp: Date;
  }>;
  completedAt?: Date;
  isActive: boolean;
}

export interface BranchStatistics {
  storyId: string;
  segmentId: string;
  choiceId: string;
  totalSelections: number;
  percentageSelected: number;
  avgTimeSpent?: number;
}

/**
 * Story Branching Service - Frontend API client
 * Handles all multi-branching story operations
 */
export class BranchingService {
  /**
   * Create a new branching story
   */
  static async createBranchingStory(
    storyId: string,
    initialContent: string,
    choices: Array<{ text: string }>,
    genre?: string
  ): Promise<StorySegment> {
    const response = await axios.post(`${BASE_URL}`, {
      storyId,
      initialContent,
      choices,
      ...(genre && { genre }),
    });
    return response.data.data;
  }

  /**
   * Create a new segment branching from parent
   */
  static async createSegment(
    storyId: string,
    parentSegmentId: string,
    content: string,
    choices: Array<{ text: string }>
  ): Promise<StorySegment> {
    const response = await axios.post(`${BASE_URL}/segments`, {
      storyId,
      parentSegmentId,
      content,
      choices,
    });
    return response.data.data;
  }

  /**
   * Get complete branch tree for a story
   */
  static async getBranchTree(storyId: string, maxDepth?: number) {
    const params = new URLSearchParams();
    if (maxDepth) params.append("maxDepth", maxDepth.toString());

    const response = await axios.get(`${BASE_URL}/${storyId}/tree`, { params });
    return response.data.data;
  }

  /**
   * Record user choice and track progress
   */
  static async recordUserChoice(
    storyId: string,
    currentSegmentId: string,
    choiceId: string,
    choiceText: string
  ): Promise<UserChoiceProgress> {
    const response = await axios.post(`${BASE_URL}/choices/record`, {
      storyId,
      currentSegmentId,
      choiceId,
      choiceText,
    });
    return response.data.data;
  }

  /**
   * Get user's progress through a branching story
   */
  static async getUserProgress(storyId: string): Promise<UserChoiceProgress | null> {
    const response = await axios.get(`${BASE_URL}/${storyId}/progress`);
    return response.data.data;
  }

  /**
   * Get choice statistics for a story
   */
  static async getChoiceStatistics(storyId: string): Promise<BranchStatistics[]> {
    const response = await axios.get(`${BASE_URL}/${storyId}/statistics`);
    return response.data.data;
  }

  /**
   * Get choice statistics summary
   */
  static async getStatisticsSummary(storyId: string) {
    const response = await axios.get(`${BASE_URL}/${storyId}/statistics/summary`);
    return response.data.data;
  }

  /**
   * Validate branch integrity
   */
  static async validateBranchIntegrity(storyId: string, checkCircular = true, checkOrphaned = true) {
    const response = await axios.post(`${BASE_URL}/validate`, {
      storyId,
      checkCircular,
      checkOrphaned,
    });
    return response.data.data;
  }

  /**
   * Delete a segment
   */
  static async deleteSegment(segmentId: string): Promise<void> {
    await axios.delete(`${BASE_URL}/segments/${segmentId}`);
  }
}
