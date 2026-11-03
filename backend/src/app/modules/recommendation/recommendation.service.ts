import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";
import { ITokenPayload } from "../../../interfaces/token";
import { IPost } from "../post/post.interface";

const getPersonalizedRecommendations = async (token: ITokenPayload) => {
  const user = await User.findById(token._id)
    .select("readingPreferences readingHistory")
    .lean();

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const { readingPreferences, readingHistory } = user;

  // Base query: not deleted and published
  const query: any = { isDeleted: false, isPublished: true };

  // ISSUE #3994 FIX: Cap the exclusion list to the most recent 100 reads.
  // This limits the size of the $nin array, preventing MongoDB query 
  // planner degradation and collection scans for highly active users.
  const EXCLUSION_LIMIT = 100;
  const cappedReadingHistory = readingHistory && readingHistory.length > 0
    ? readingHistory.slice(-EXCLUSION_LIMIT)
    : [];

  // Exclude read posts using the optimized, capped history
  if (cappedReadingHistory.length > 0) {
    query._id = { $nin: cappedReadingHistory };
  }

  let recommendations: IPost[] = [];

  // If user has preferences, try to match them
  if (readingPreferences) {
    // Create copies before sorting to avoid mutating the original arrays
    const favoriteGenres = (readingPreferences.favoriteGenres || [])
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(g => g.name);

    const favoriteEmotions = (readingPreferences.favoriteEmotions || [])
      .slice()
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
        .select("_id title imageURL author emotions genre likesCount viewsCount publishedAt createdAt")
        .sort({ likesCount: -1, viewsCount: -1 })
        .limit(10)
        .lean() as any;
    }
  }

  // Fallback: If no preferences or not enough recommendations, get top popular posts
  if (recommendations.length < 10) {
    const limit = 10 - recommendations.length;
    const recommendationIds = recommendations.map(r => (r as any)._id);

    // Add existing recommendations to exclusion list to avoid duplicates.
    // CRITICAL: Use cappedReadingHistory here as well so the fallback query doesn't bottleneck.
    const fallbackQuery = {
      ...query,
      ...(recommendationIds.length > 0 && {
        _id: {
          $nin: [...cappedReadingHistory, ...recommendationIds]
        }
      })
    };

    const popularPosts = await Post.find(fallbackQuery)
      .populate("author", "name profile.avatar")
      .select("_id title imageURL author emotions genre likesCount viewsCount publishedAt createdAt")
      .sort({ likesCount: -1, viewsCount: -1 })
      .limit(limit)
      .lean() as any;

    recommendations = [...recommendations, ...popularPosts];
  }

  return recommendations;
};

export const RecommendationService = {
  getPersonalizedRecommendations,
};