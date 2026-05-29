import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { Post } from "../post/post.model";
import { ConsistencyReport } from "./consistency.model";
import { analyzeConsistencyWithGemini } from "./consistency.utils";
import { Types } from "mongoose";

const generateReport = async (postId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story (Post) not found!");
  }

  // Generate analysis
  const aiResult = await analyzeConsistencyWithGemini(post.title, post.content);

  // Upsert the consistency report
  const existingReport = await ConsistencyReport.findOne({ postId: post._id });

  if (existingReport) {
    existingReport.score = aiResult.score ?? 100;
    existingReport.characters = aiResult.characters ?? [];
    existingReport.timeline = aiResult.timeline ?? [];
    existingReport.contradictions = aiResult.contradictions ?? [];
    await existingReport.save();
    return existingReport;
  } else {
    const newReport = await ConsistencyReport.create({
      postId: post._id,
      score: aiResult.score ?? 100,
      characters: aiResult.characters ?? [],
      timeline: aiResult.timeline ?? [],
      contradictions: aiResult.contradictions ?? [],
    });
    return newReport;
  }
};

const getReport = async (postId: string) => {
  const report = await ConsistencyReport.findOne({ postId: new Types.ObjectId(postId) });
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Consistency report not found for this story. Please run an analysis first.");
  }
  return report;
};

export const ConsistencyService = {
  generateReport,
  getReport,
};
