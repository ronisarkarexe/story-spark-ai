import { Post } from "../post/post.model";
import { User } from "../user/user.model";

interface SearchQuery {
  q: string;
  type?: "story" | "user" | "tag" | "all";
  genre?: string;
  sortBy?: "relevance" | "date" | "popularity";
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Escape MongoDB operator characters from user input
const sanitizeQuery = (input: string): string => {
  return input.replace(/[$\.]/g, "").trim().slice(0, 200);
};

const searchStories = async (
  q: string,
  filters: Pick<SearchQuery, "genre" | "sortBy" | "dateFrom" | "dateTo">,
  page: number,
  limit: number
) => {
  const { genre, sortBy, dateFrom, dateTo } = filters;

  const matchStage: Record<string, unknown> = {
    $text: { $search: q },
    isDeleted: false,
    isPublished: true,
  };

  if (genre) matchStage.genre = genre;
  if (dateFrom || dateTo) {
    matchStage.createdAt = {};
    if (dateFrom) (matchStage.createdAt as Record<string, unknown>).$gte = new Date(dateFrom);
    if (dateTo) (matchStage.createdAt as Record<string, unknown>).$lte = new Date(dateTo);
  }

  const sortStage: any =
    sortBy === "date"
      ? { createdAt: -1 }
      : sortBy === "popularity"
      ? { likesCount: -1, viewsCount: -1 }
      : { score: { $meta: "textScore" } };

  const [results, total] = await Promise.all([
    Post.find(matchStage, { score: { $meta: "textScore" } })
      .sort(sortStage)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name profile.avatar")
      .lean(),
    Post.countDocuments(matchStage),
  ]);

  return { results, total };
};

const searchUsers = async (q: string, page: number, limit: number) => {
  // Escape regex special chars for safe fuzzy match on username
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  const filter = { name: regex };

  const [results, total] = await Promise.all([
    User.find(filter)
      .select("name email profile.avatar profile.bio")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return { results, total };
};

const searchTags = async (q: string, page: number, limit: number) => {
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  const [results, total] = await Promise.all([
    Post.find({ tag: regex, isDeleted: false }, { tag: 1, title: 1, _id: 1 })
      .distinct("tag"),
    Post.distinct("tag", { tag: regex, isDeleted: false }),
  ]);

  const paged = results.slice((page - 1) * limit, page * limit);

  return { results: paged.map((t) => ({ tag: t })), total: total.length };
};

export const SearchService = {
  async search(params: SearchQuery) {
    const {
      q: rawQ,
      type = "all",
      genre,
      sortBy = "relevance",
      page = 1,
      limit = 10,
      dateFrom,
      dateTo,
    } = params;

    const q = sanitizeQuery(rawQ);

    if (!q) return { stories: null, users: null, tags: null };

    const storyFilters = { genre, sortBy, dateFrom, dateTo };

    const [storiesResult, usersResult, tagsResult] = await Promise.all([
      type === "story" || type === "all" ? searchStories(q, storyFilters, page, limit) : null,
      type === "user" || type === "all" ? searchUsers(q, page, limit) : null,
      type === "tag" || type === "all" ? searchTags(q, page, limit) : null,
    ]);

    return {
      stories: storiesResult
        ? { data: storiesResult.results, total: storiesResult.total, page, limit }
        : null,
      users: usersResult
        ? { data: usersResult.results, total: usersResult.total, page, limit }
        : null,
      tags: tagsResult
        ? { data: tagsResult.results, total: tagsResult.total, page, limit }
        : null,
    };
  },
};