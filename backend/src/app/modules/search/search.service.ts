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
  searchType?: "simple" | "complex" | "auto";
}

// Escape MongoDB operator characters from user input
const sanitizeQuery = (input: string): string => {
  return input.replace(/[$\.]/g, "").trim().slice(0, 200);
};

const isComplexQuery = (q: string): boolean => {
  const words = q.split(" ").filter(w => w.trim().length > 0);
  return words.length > 3 || q.length > 30;
};

const searchStoriesAdvanced = async (
  q: string,
  filters: Pick<SearchQuery, "genre" | "sortBy" | "dateFrom" | "dateTo">,
  page: number,
  limit: number
) => {
  const { genre, sortBy, dateFrom, dateTo } = filters;

  const pipeline: any[] = [
    {
      $search: {
        index: "post_search",
        text: {
          query: q,
          path: ["title", "content", "tag"]
        }
      }
    },
    { $match: { isDeleted: false, isPublished: true } }
  ];

  if (genre) {
    pipeline.push({ $match: { genre } });
  }

  if (dateFrom || dateTo) {
    const dateMatch: any = {};
    if (dateFrom) dateMatch.$gte = new Date(dateFrom);
    if (dateTo) dateMatch.$lte = new Date(dateTo);
    pipeline.push({ $match: { createdAt: dateMatch } });
  }

  const sortStage: any =
    sortBy === "date"
      ? { createdAt: -1 }
      : sortBy === "popularity"
      ? { likesCount: -1, viewsCount: -1 }
      : null; // relevance is default by score

  if (sortStage) {
    pipeline.push({ $sort: sortStage });
  } else {
    pipeline.push({ $sort: { score: { $meta: "textScore" } } }); // fallback if needed though Atlas ranks natively
  }

  pipeline.push({ $skip: (page - 1) * limit });
  pipeline.push({ $limit: limit });

  const countPipeline = [...pipeline];
  countPipeline.splice(countPipeline.length - 2, 2); // remove skip and limit
  countPipeline.push({ $count: "total" });

  const [results, countResult] = await Promise.all([
    Post.aggregate(pipeline),
    Post.aggregate(countPipeline)
  ]);

  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Populate author since aggregate doesn't populate by default
  await Post.populate(results, { path: "author", select: "name profile.avatar" });

  return { results, total };
};

const searchStories = async (
  q: string,
  filters: Pick<SearchQuery, "genre" | "sortBy" | "dateFrom" | "dateTo">,
  page: number,
  limit: number,
  searchType: "simple" | "complex" | "auto" = "auto"
) => {
  const isComplex = searchType === "complex" || (searchType === "auto" && isComplexQuery(q));

  // If complex search is needed, try to route to Atlas Search.
  if (isComplex) {
    try {
      // In a real environment, we'd ensure 'post_search' Atlas index exists.
      // If it fails, fallback to simple MongoDB text search.
      return await searchStoriesAdvanced(q, filters, page, limit);
    } catch (error) {
      console.warn("Atlas search failed or index not found. Falling back to simple text search.", error);
    }
  }

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
      type === "story" || type === "all" ? searchStories(q, storyFilters, page, limit, params.searchType) : null,
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