import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";
import { ITokenPayload } from "../../../interfaces/token";
import mongoose from "mongoose";
import { IPost } from "../post/post.interface";
const getPersonalizedRecommendations = async (token: ITokenPayload) => {
  const user = await User.findById(token._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const { readingPreferences, readingHistory } = user;
  
  // Base query: not deleted and published
  const query: any = { isDeleted: false, isPublished: true };
  
  // Exclude read posts
  if (readingHistory && readingHistory.length > 0) {
    query._id = { $nin: readingHistory };
  }

  let recommendations: IPost[] = [];

  // If user has preferences, try to match them
  if (readingPreferences) {
    const favoriteGenres = readingPreferences.favoriteGenres
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(g => g.name);
      
    const favoriteEmotions = readingPreferences.favoriteEmotions
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(e => e.name);

    if (favoriteGenres.length > 0 || favoriteEmotions.length > 0) {
      const orConditions = [];
      if (favoriteGenres.length > 0) {
        orConditions.push({ genre: { $in: favoriteGenres } });
      }
      if (favoriteEmotions.length > 0) {
        orConditions.push({ emotions: { $in: favoriteEmotions } });
      }
      
      const prefQuery = { ...query, $or: orConditions };
      recommendations = await Post.find(prefQuery)
        .populate("author", "name profile.avatar")
        .sort({ likesCount: -1, viewsCount: -1 })
        .limit(10);
    }
  }

  // Fallback: If no preferences or not enough recommendations, get top popular posts
  if (recommendations.length < 10) {
    const limit = 10 - recommendations.length;
    const recommendationIds = recommendations.map(r => (r as any)._id);
    
    // Add existing recommendations to exclusion list to avoid duplicates
    const fallbackQuery = { 
      ...query, 
      ...(recommendationIds.length > 0 && {
        _id: { 
          $nin: [...(readingHistory || []), ...recommendationIds] 
        }
      })
    };

    const popularPosts = await Post.find(fallbackQuery)
      .populate("author", "name profile.avatar")
      .sort({ likesCount: -1, viewsCount: -1 })
      .limit(limit);
      
    recommendations = [...recommendations, ...popularPosts];
  }

  return recommendations;
};

export const RecommendationService = {
  getPersonalizedRecommendations,
};
