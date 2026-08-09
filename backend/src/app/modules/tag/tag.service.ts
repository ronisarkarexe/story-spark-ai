import { Post } from "../post/post.model";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";

const PREDEFINED_TAG_MAP: Record<string, string[]> = {
  Fantasy: ["magic", "wizard", "dragon", "spell", "kingdom", "elf", "quest", "sword", "fairy", "castle", "legend", "mythical"],
  "Sci-Fi": ["space", "robot", "alien", "galaxy", "future", "technology", "starship", "planet", "cyber", "ai", "machine", "spaceship"],
  Mystery: ["crime", "detective", "clue", "suspect", "murder", "secret", "puzzle", "shadow", "spy", "investigation", "thief"],
  Romance: ["love", "heart", "friendship", "relationship", "kiss", "marriage", "date", "romantic", "soulmate", "affection"],
  Adventure: ["journey", "explore", "treasure", "map", "danger", "wild", "forest", "sea", "sail", "rescue", "mountain", "climb"],
  Horror: ["ghost", "fear", "darkness", "monster", "blood", "scream", "haunted", "nightmare", "zombie", "spooky", "shadows"],
  Drama: ["family", "tragedy", "struggle", "grief", "tear", "betrayal", "conflict", "emotional", "hope", "death", "trust"]
};

const STOPWORDS = new Set([
  "the", "and", "a", "of", "to", "in", "is", "that", "it", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i", "at", 
  "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", 
  "said", "there", "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", 
  "then", "them", "these", "so", "some", "her", "would", "make", "like", "him", "into", "has", "look", "two", "more", "write", "go", 
  "see", "number", "no", "way", "could", "people", "my", "than", "first", "water", "been", "call", "who", "oil", "its", "now", "find",
  "about", "very", "were", "been", "have", "with", "they", "this", "some", "them", "then", "only", "also", "into", "over", "more", 
  "other", "your", "than", "upon", "down", "into"
]);

const getPopularTags = async (limit: number = 20) => {
  try {
    const result = await Post.aggregate([
      { $match: { isDeleted: { $ne: true }, isPublished: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);
    
    if (result.length === 0) {
      // Default placeholder tags if no tags exist in the DB yet
      return [
        { name: "Fantasy", count: 12 },
        { name: "Sci-Fi", count: 9 },
        { name: "Mystery", count: 7 },
        { name: "Romance", count: 6 },
        { name: "Adventure", count: 5 },
        { name: "Magic", count: 4 },
        { name: "Space", count: 3 }
      ];
    }
    
    return result.map(item => ({ name: item._id, count: item.count }));
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get popular tags");
  }
};

const suggestTags = async (title: string, content: string): Promise<string[]> => {
  const combinedText = `${title} ${content}`.toLowerCase();
  const suggestions = new Set<string>();

  // 1. Check for predefined storytelling keyword mappings
  for (const [tag, keywords] of Object.entries(PREDEFINED_TAG_MAP)) {
    for (const kw of keywords) {
      if (combinedText.includes(kw)) {
        suggestions.add(tag);
        // Also add the matching keyword itself if it feels like a nice tag
        if (kw.length >= 4 && !STOPWORDS.has(kw)) {
          suggestions.add(kw.charAt(0).toUpperCase() + kw.slice(1));
        }
      }
    }
  }

  // 2. Extract words and compute frequencies
  const words = combinedText.match(/[a-z]+/g) || [];
  const wordCounts: Record<string, number> = {};

  for (const word of words) {
    if (word.length > 4 && !STOPWORDS.has(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  }

  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

  for (const word of sortedWords) {
    suggestions.add(word);
  }

  // Return top 8 suggestions
  return Array.from(suggestions).slice(0, 8);
};

const renameTag = async (oldTag: string, newTag: string) => {
  if (!oldTag || !newTag) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Both oldTag and newTag are required");
  }

  const trimmedOld = oldTag.trim();
  const trimmedNew = newTag.trim();

  // Find all posts that contain oldTag
  const posts = await Post.find({ tags: trimmedOld });
  const postIds = posts.map(p => p._id);
  
  if (postIds.length > 0) {
    // Pull oldTag from these posts
    await Post.updateMany(
      { _id: { $in: postIds } },
      { $pull: { tags: trimmedOld } }
    );
    // Add newTag to these posts (using $addToSet to avoid duplicates)
    await Post.updateMany(
      { _id: { $in: postIds } },
      { $addToSet: { tags: trimmedNew } }
    );
  }

  return { success: true, message: `Tag renamed from "${trimmedOld}" to "${trimmedNew}"` };
};

const deleteTag = async (tag: string) => {
  if (!tag) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Tag is required for deletion");
  }

  const trimmedTag = tag.trim();

  const result = await Post.updateMany(
    { tags: trimmedTag },
    { $pull: { tags: trimmedTag } }
  );

  return { success: true, message: `Tag "${trimmedTag}" removed from ${result.modifiedCount} stories.` };
};

const getRecommendedStories = async (storyId: string, limit: number = 5) => {
  try {
    const story = await Post.findById(storyId);
    if (!story || !story.tags || story.tags.length === 0) {
      // Fallback to latest stories
      const fallback = await Post.find({ _id: { $ne: storyId }, isDeleted: { $ne: true }, isPublished: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("author", "name email createdAt");
      return fallback;
    }

    // Find stories sharing tags
    const recommendations = await Post.find({
      _id: { $ne: storyId },
      isDeleted: { $ne: true },
      isPublished: true,
      tags: { $in: story.tags }
    })
      .limit(limit)
      .populate("author", "name email createdAt");

    if (recommendations.length < limit) {
      const recIds = new Set(recommendations.map(r => r._id.toString()));
      recIds.add(storyId);

      const additional = await Post.find({
        _id: { $nin: Array.from(recIds) },
        isDeleted: { $ne: true },
        isPublished: true
      })
        .sort({ createdAt: -1 })
        .limit(limit - recommendations.length)
        .populate("author", "name email createdAt");
      
      return [...recommendations, ...additional];
    }

    return recommendations;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get recommended stories");
  }
};

export const TagService = {
  getPopularTags,
  suggestTags,
  renameTag,
  deleteTag,
  getRecommendedStories
};
