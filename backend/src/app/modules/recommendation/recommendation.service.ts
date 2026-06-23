import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";
import { ITokenPayload } from "../../../interfaces/token";
import { IPost } from "../post/post.interface";
import { PreferredLength } from "../user/reading_preferences.constants";

const USER_RECOMMENDATION_FIELDS = "readingPreferences readingHistory";
const POST_RECOMMENDATION_FIELDS =
  "_id title imageURL author emotions genre likesCount viewsCount publishedAt createdAt";
const AUTHOR_RECOMMENDATION_FIELDS = "name profile.avatar";

const getLengthCategory = (content: string): PreferredLength => {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  
  if (wordCount < 1000) {
    return "short";
  }

  if (wordCount <= 3000) {
    return "medium";
  }

  return "long";
};

const getRecommendationScore = (
  post: IPost,
  genres: string[],
  moods: string[],
  preferredLength?: PreferredLength
) => {
  let score = 0;

  if (genres.length > 0 && post.genre && genres.includes(post.genre)) {
    score += 3;
  }

  if (moods.length > 0 && post.emotions?.some((emotion) => moods.includes(emotion))) {
    score += 2;
  }

  if (preferredLength) {
    const lengthCategory = getLengthCategory(post.content);
    if (lengthCategory === preferredLength) {
      score += 1;
    }
  }

  return score;
};

const rankRecommendations = (
  posts: IPost[],
  genres: string[],
  moods: string[],
  preferredLength?: PreferredLength
) =>
  [...posts].sort((left, right) => {
    const scoreDifference =
      getRecommendationScore(right, genres, moods, preferredLength) -
      getRecommendationScore(left, genres, moods, preferredLength);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return (
      right.likesCount +
      right.viewsCount -
      (left.likesCount + left.viewsCount)
    );
  });

const getPersonalizedRecommendations = async (token: ITokenPayload) => {
  const user = await User.findById(token._id)
    .select(USER_RECOMMENDATION_FIELDS)
    .lean();

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const { readingPreferences, readingHistory } = user;

  const query: Record<string, unknown> = { isDeleted: false, isPublished: true };

  if (readingHistory && readingHistory.length > 0) {
    query._id = { $nin: readingHistory };
  }

  let recommendations: IPost[] = [];

  if (readingPreferences) {
    const onboardingGenres = readingPreferences.genres ?? [];
    const onboardingMoods = readingPreferences.moods ?? [];
    const preferredLength = readingPreferences.preferredLength;

    const favoriteGenres = [...(readingPreferences.favoriteGenres ?? [])]
      .sort((left, right) => right.count - left.count)
      .slice(0, 3)
      .map((genre) => genre.name);

    const favoriteEmotions = [...(readingPreferences.favoriteEmotions ?? [])]
      .sort((left, right) => right.count - left.count)
      .slice(0, 3)
      .map((emotion) => emotion.name);

    const genres = onboardingGenres.length > 0 ? onboardingGenres : favoriteGenres;
    const moods = onboardingMoods.length > 0 ? onboardingMoods : favoriteEmotions;

    if (genres.length > 0 || moods.length > 0) {
      const orConditions: Record<string, unknown>[] = [];

      if (genres.length > 0) {
        orConditions.push({ genre: { $in: genres } });
      }

      if (moods.length > 0) {
        orConditions.push({ emotions: { $in: moods } });
      }

      const prefQuery = { ...query, $or: orConditions };
      recommendations = await Post.find(prefQuery)
        .populate("author", AUTHOR_RECOMMENDATION_FIELDS)
        .select(POST_RECOMMENDATION_FIELDS)
        .sort({ likesCount: -1, viewsCount: -1 })
        .limit(10)
        .lean();
    }
  }

  if (recommendations.length < 10) {
    const limit = 10 - recommendations.length;
    const recommendationIds = recommendations.map((post) => post._id);

    const fallbackQuery = {
      ...query,
      ...(recommendationIds.length > 0 && {
        _id: {
          $nin: [...(readingHistory || []), ...recommendationIds],
        },
      }),
    };

    const popularPosts = await Post.find(fallbackQuery)
      .populate("author", AUTHOR_RECOMMENDATION_FIELDS)
      .select(POST_RECOMMENDATION_FIELDS)
      .sort({ likesCount: -1, viewsCount: -1 })
      .limit(limit)
      .lean();

    recommendations = [...recommendations, ...popularPosts];
  }

  if (readingPreferences) {
    const onboardingGenres = readingPreferences.genres ?? [];
    const onboardingMoods = readingPreferences.moods ?? [];
    const favoriteGenres = [...(readingPreferences.favoriteGenres ?? [])]
      .sort((left, right) => right.count - left.count)
      .slice(0, 3)
      .map((genre) => genre.name);
    const favoriteEmotions = [...(readingPreferences.favoriteEmotions ?? [])]
      .sort((left, right) => right.count - left.count)
      .slice(0, 3)
      .map((emotion) => emotion.name);

    recommendations = rankRecommendations(
      recommendations,
      onboardingGenres.length > 0 ? onboardingGenres : favoriteGenres,
      onboardingMoods.length > 0 ? onboardingMoods : favoriteEmotions,
      readingPreferences.preferredLength
    );
  }

  return recommendations;
};

export const RecommendationService = {
  getPersonalizedRecommendations,
};
