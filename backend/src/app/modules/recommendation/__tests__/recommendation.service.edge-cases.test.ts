/**
 * recommendation.service.edge-cases.test.ts
 * Edge case tests for RecommendationService.getPersonalizedRecommendations
 */
import { Types } from "mongoose";
import { Post } from "../../post/post.model";
import { User } from "../../user/user.model";
import { RecommendationService } from "../recommendation.service";
import { ITokenPayload } from "../../../../interfaces/token";

jest.mock("../../post/post.model", () => ({
  Post: {
    find: jest.fn(),
  },
  PostSchema: { indexes: jest.fn().mockReturnValue([]) },
}));

jest.mock("../../user/user.model", () => ({
  User: {
    findById: jest.fn(),
  },
}));

const mockedPost = Post as unknown as {
  find: jest.Mock;
};

const mockedUser = User as unknown as {
  findById: jest.Mock;
};

const userId = new Types.ObjectId("507f1f77bcf86cd799439011");

const token = {
  _id: userId.toString(),
  email: "reader@example.com",
  role: "user",
} as ITokenPayload;

type QueryChain = {
  populate: jest.Mock;
  select: jest.Mock;
  sort: jest.Mock;
  limit: jest.Mock;
  lean: jest.Mock;
};

const createUserQuery = (result: unknown) => {
  mockedUser.findById.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result),
  });
};

const createPostQuery = (result: unknown): QueryChain => {
  const query = {
    populate: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result),
  };
  mockedPost.find.mockReturnValueOnce(query);
  return query;
};

const makePost = (id: Types.ObjectId, overrides = {}) => ({
  _id: id,
  title: "Story Title",
  imageURL: "https://example.com/img.jpg",
  author: { _id: userId, name: "Author Name", profile: { avatar: "" } },
  emotions: ["Joy"],
  genre: "Fantasy",
  likesCount: 10,
  viewsCount: 100,
  publishedAt: new Date(),
  createdAt: new Date(),
  ...overrides,
});

describe("getPersonalizedRecommendations edge cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("excludes all read posts from recommendations when readingHistory has multiple entries", async () => {
    const readPost1 = new Types.ObjectId();
    const readPost2 = new Types.ObjectId();
    const readPost3 = new Types.ObjectId();

    const post1 = makePost(new Types.ObjectId());
    const post2 = makePost(new Types.ObjectId());

    createUserQuery({
      readingPreferences: undefined,
      readingHistory: [readPost1, readPost2, readPost3],
    });
    createPostQuery([post1, post2]);

    const result = await RecommendationService.getPersonalizedRecommendations(token);

    expect(result).toHaveLength(2);
    expect(mockedPost.find).toHaveBeenCalledWith({
      isDeleted: false,
      isPublished: true,
      _id: { $nin: [readPost1, readPost2, readPost3] },
    });
  });

  it("returns exactly 10 recommendations when enough posts exist", async () => {
    const posts = Array.from({ length: 15 }, (_, i) =>
      makePost(new Types.ObjectId(), {
        title: `Popular Story ${i}`,
        likesCount: 100 - i,
      }),
    );

    createUserQuery({
      readingPreferences: {
        favoriteGenres: [{ name: "Fantasy", count: 5 }],
        favoriteEmotions: [],
      },
      readingHistory: [],
    });
    // First call returns 3 posts (preference match)
    createPostQuery(posts.slice(0, 3));
    // Second call returns 10 posts (fallback) — limit should be 7
    createPostQuery(posts.slice(3, 10));

    const result = await RecommendationService.getPersonalizedRecommendations(token);

    expect(result).toHaveLength(10);
  });

  it("skips fallback query when preference query returns 10 or more posts", async () => {
    const posts = Array.from({ length: 12 }, (_, i) =>
      makePost(new Types.ObjectId(), { title: `Post ${i}` }),
    );

    createUserQuery({
      readingPreferences: {
        favoriteGenres: [{ name: "Fantasy", count: 5 }],
        favoriteEmotions: [],
      },
      readingHistory: [],
    });
    createPostQuery(posts);

    const result = await RecommendationService.getPersonalizedRecommendations(token);

    expect(result).toHaveLength(12);
    expect(mockedPost.find).toHaveBeenCalledTimes(1);
  });

  it("deduplicates between preference and fallback queries", async () => {
    // Preference returns 5 posts, fallback returns 5 different posts
    const posts = Array.from({ length: 10 }, (_, i) =>
      makePost(new Types.ObjectId(), { title: `Post ${i}` }),
    );

    createUserQuery({
      readingPreferences: {
        favoriteGenres: [{ name: "Fantasy", count: 5 }],
        favoriteEmotions: [],
      },
      readingHistory: [],
    });
    createPostQuery(posts.slice(0, 5));
    createPostQuery(posts.slice(5, 10));

    const result = await RecommendationService.getPersonalizedRecommendations(token);

    expect(result).toHaveLength(10);
    const ids = result.map((p) => String((p as any)._id));
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(10);
  });

  it("uses top-3 genres when there are more than 3 favorites", async () => {
    const posts = Array.from({ length: 10 }, (_, i) =>
      makePost(new Types.ObjectId(), {
        genre: i < 3 ? "Fantasy" : i < 6 ? "Romance" : "Sci-Fi",
        title: `Post ${i}`,
      }),
    );

    createUserQuery({
      readingPreferences: {
        favoriteGenres: [
          { name: "Fantasy", count: 5 },
          { name: "Romance", count: 4 },
          { name: "Sci-Fi", count: 3 },
          { name: "Horror", count: 2 },
          { name: "Mystery", count: 1 },
        ],
        favoriteEmotions: [],
      },
      readingHistory: [],
    });
    createPostQuery(posts);

    await RecommendationService.getPersonalizedRecommendations(token);

    const queryArg = mockedPost.find.mock.calls[0][0];
    const genreFilter = queryArg.$or.find(
      (f: any) => f.genre != null,
    ) as { genre: { $in: string[] } } | undefined;
    expect(genreFilter?.genre.$in).toContain("Fantasy");
    expect(genreFilter?.genre.$in).toContain("Romance");
    expect(genreFilter?.genre.$in).toContain("Sci-Fi");
    expect(genreFilter?.genre.$in).not.toContain("Horror");
    expect(genreFilter?.genre.$in).not.toContain("Mystery");
  });

  it("uses top-3 emotions when there are more than 3 favorite emotions", async () => {
    const posts = Array.from({ length: 10 }, (_, i) =>
      makePost(new Types.ObjectId(), {
        emotions: [i < 3 ? "Joy" : i < 6 ? "Calm" : "Wonder"],
        title: `Post ${i}`,
      }),
    );

    createUserQuery({
      readingPreferences: {
        favoriteGenres: [],
        favoriteEmotions: [
          { name: "Joy", count: 5 },
          { name: "Calm", count: 4 },
          { name: "Wonder", count: 3 },
          { name: "Sadness", count: 2 },
          { name: "Fear", count: 1 },
        ],
      },
      readingHistory: [],
    });
    createPostQuery(posts);

    await RecommendationService.getPersonalizedRecommendations(token);

    const queryArg = mockedPost.find.mock.calls[0][0];
    const emotionFilter = queryArg.$or.find(
      (f: any) => f.emotions != null,
    ) as { emotions: { $in: string[] } } | undefined;
    expect(emotionFilter?.emotions.$in).toContain("Joy");
    expect(emotionFilter?.emotions.$in).toContain("Calm");
    expect(emotionFilter?.emotions.$in).toContain("Wonder");
    expect(emotionFilter?.emotions.$in).not.toContain("Sadness");
    expect(emotionFilter?.emotions.$in).not.toContain("Fear");
  });

  it("combines genre and emotion filters with OR when both are present", async () => {
    const posts = Array.from({ length: 10 }, () =>
      makePost(new Types.ObjectId(), {
        genre: "Fantasy",
        emotions: ["Joy"],
      }),
    );

    createUserQuery({
      readingPreferences: {
        favoriteGenres: [{ name: "Fantasy", count: 2 }],
        favoriteEmotions: [{ name: "Joy", count: 1 }],
      },
      readingHistory: [],
    });
    createPostQuery(posts);

    await RecommendationService.getPersonalizedRecommendations(token);

    const queryArg = mockedPost.find.mock.calls[0][0];
    expect(queryArg.$or).toHaveLength(2);
    expect(queryArg.$or[0]).toEqual({ genre: { $in: ["Fantasy"] } });
    expect(queryArg.$or[1]).toEqual({ emotions: { $in: ["Joy"] } });
  });

  it("returns empty array when no posts match preferences and no fallback posts exist", async () => {
    createUserQuery({
      readingPreferences: {
        favoriteGenres: [{ name: "NonExistent", count: 5 }],
        favoriteEmotions: [],
      },
      readingHistory: [],
    });
    // First call: preference query returns 0 posts
    createPostQuery([]);
    // Second call: fallback query also returns 0 posts
    mockedPost.find.mockReturnValueOnce({
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([]),
    });

    const result = await RecommendationService.getPersonalizedRecommendations(token);

    expect(result).toHaveLength(0);
    expect(mockedPost.find).toHaveBeenCalledTimes(2);
  });
});
