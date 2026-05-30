import { IReviewPayload } from "./review.interface";
import { Review } from "./review.model";
import redis from "../../utils/redis.client";

const PUBLISHED_REVIEWS_KEY = "reviews:published:v1";
const REVIEWS_CACHE_TTL = Number(process.env.REVIEWS_CACHE_TTL) || 300; // seconds

const createReview = async (payload: IReviewPayload) => {
  const result = await Review.create(payload);

  // Invalidate cache (best-effort)
  try {
    await redis.del(PUBLISHED_REVIEWS_KEY);
  } catch (err) {
    console.warn("Redis DEL failed (createReview):", err);
  }

  return result;
};

const getPublishedReviews = async () => {
  // Try cache first
  try {
    const cached = await redis.get(PUBLISHED_REVIEWS_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn("Redis GET failed (getPublishedReviews):", err);
  }

  // Fallback to DB
  const result = await Review.find({ isPublished: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  // Populate cache (best-effort)
  try {
    await redis.set(PUBLISHED_REVIEWS_KEY, JSON.stringify(result), "EX", REVIEWS_CACHE_TTL);
  } catch (err) {
    console.warn("Redis SET failed (getPublishedReviews):", err);
  }

  return result;
};

const getPendingReviews = async () => {
  const result = await Review.find({
    isPublished: false,
  }).sort({ createdAt: -1 });

  return result;
};

const approveReview = async (id: string) => {
  const result = await Review.findByIdAndUpdate(
    id,
    {
      isPublished: true,
    },
    {
      new: true,
    }
  );

  // Invalidate cache (best-effort)
  try {
    await redis.del(PUBLISHED_REVIEWS_KEY);
  } catch (err) {
    console.warn("Redis DEL failed (approveReview):", err);
  }

  return result;
};

export const ReviewService = {
  createReview,
  getPublishedReviews,
  getPendingReviews,
  approveReview,
};