import { Types } from "mongoose";
import { Post, PostSchema } from "../../post/post.model";
import { User } from "../../user/user.model";
import { RecommendationService } from "../recommendation.service";
import { ITokenPayload } from "../../../../interfaces/token";

jest.mock("../../post/post.model", () => {
  const actual = jest.requireActual("../../post/post.model");
  return {
    ...actual,
    Post: {
      find: jest.fn(),
    },
  };
});

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

const USER_RECOMMENDATION_FIELDS = "readingPreferences readingHistory";
const POST_RECOMMENDATION_FIELDS =
  "_id title imageURL author emotions genre likesCount viewsCount publishedAt createdAt";
const AUTHOR_RECOMMENDATION_FIELDS = "name profile.avatar";

const userId = new Types.ObjectId("507f1f77bcf86cd799439011");
const readPostId = new Types.ObjectId("507f1f77bcf86cd799439012");

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
  const query = {
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(result),
  };

  mockedUser.findById.mockReturnValue(query);
  return query;
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

const createRecommendationPost = (id: Types.ObjectId, overrides = {}) => ({
  _id: id,
  title: "A focused story",
  imageURL: "https://example.com/story.jpg",
  author: {
    _id: userId,
    name: "Reader Writer",
    profile: {
      avatar: "https://example.com/avatar.jpg",
    },
  },
  emotions: ["Joy"],
  genre: "Fantasy",
  likesCount: 10,
  viewsCount: 100,
  publishedAt: new Date("2026-01-01T00:00:00.000Z"),
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  ...overrides,
});

describe("RecommendationService.getPersonalizedRecommendations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses lean projected reads for user and preferred post recommendations", async () => {
    const post = createRecommendationPost(
      new Types.ObjectId("507f1f77bcf86cd799439013")
    );
    const user = {
      readingPreferences: {
        favoriteGenres: [
          { name: "Fantasy", count: 3 },
          { name: "Mystery", count: 1 },
        ],
        favoriteEmotions: [{ name: "Joy", count: 2 }],
      },
      readingHistory: [readPostId],
    };

    const userQuery = createUserQuery(user);
    const preferredPostQuery = createPostQuery(Array(10).fill(post));

    const result = await RecommendationService.getPersonalizedRecommendations(
      token
    );

    expect(result).toHaveLength(10);
    expect(result[0]).toEqual(
      expect.objectContaining({
        _id: post._id,
        title: post.title,
        imageURL: post.imageURL,
        emotions: post.emotions,
        author: expect.objectContaining({
          name: "Reader Writer",
        }),
      })
    );

    expect(mockedUser.findById).toHaveBeenCalledWith(token._id);
    expect(userQuery.select).toHaveBeenCalledWith(USER_RECOMMENDATION_FIELDS);
    expect(userQuery.lean).toHaveBeenCalledTimes(1);

    expect(mockedPost.find).toHaveBeenCalledWith({
      isDeleted: false,
      isPublished: true,
      _id: { $nin: [readPostId] },
      $or: [
        { genre: { $in: ["Fantasy", "Mystery"] } },
        { emotions: { $in: ["Joy"] } },
      ],
    });
    expect(preferredPostQuery.populate).toHaveBeenCalledWith(
      "author",
      AUTHOR_RECOMMENDATION_FIELDS
    );
    expect(preferredPostQuery.select).toHaveBeenCalledWith(
      POST_RECOMMENDATION_FIELDS
    );
    expect(preferredPostQuery.sort).toHaveBeenCalledWith({
      likesCount: -1,
      viewsCount: -1,
    });
    expect(preferredPostQuery.limit).toHaveBeenCalledWith(10);
    expect(preferredPostQuery.lean).toHaveBeenCalledTimes(1);
  });

  it("preserves fallback recommendation behavior and excludes already returned posts", async () => {
    const preferredPostId = new Types.ObjectId("507f1f77bcf86cd799439014");
    const fallbackPostId = new Types.ObjectId("507f1f77bcf86cd799439015");
    const preferredPost = createRecommendationPost(preferredPostId);
    const fallbackPost = createRecommendationPost(fallbackPostId, {
      genre: "Sci-Fi",
      emotions: ["Wonder"],
    });

    createUserQuery({
      readingPreferences: {
        favoriteGenres: [{ name: "Fantasy", count: 3 }],
        favoriteEmotions: [],
      },
      readingHistory: [readPostId],
    });
    const preferredPostQuery = createPostQuery([preferredPost]);
    const fallbackPostQuery = createPostQuery([fallbackPost]);

    const result = await RecommendationService.getPersonalizedRecommendations(
      token
    );

    expect(result).toEqual([preferredPost, fallbackPost]);
    expect(mockedPost.find).toHaveBeenCalledTimes(2);
    expect(mockedPost.find.mock.calls[1][0]).toEqual({
      isDeleted: false,
      isPublished: true,
      _id: { $nin: [readPostId, preferredPostId] },
    });
    expect(preferredPostQuery.limit).toHaveBeenCalledWith(10);
    expect(fallbackPostQuery.limit).toHaveBeenCalledWith(9);
    expect(fallbackPostQuery.select).toHaveBeenCalledWith(
      POST_RECOMMENDATION_FIELDS
    );
    expect(fallbackPostQuery.lean).toHaveBeenCalledTimes(1);
  });

  it("uses fallback popular posts when no preferences are available", async () => {
    const fallbackPost = createRecommendationPost(
      new Types.ObjectId("507f1f77bcf86cd799439016")
    );

    createUserQuery({
      readingHistory: [readPostId],
    });
    const fallbackPostQuery = createPostQuery([fallbackPost]);

    const result = await RecommendationService.getPersonalizedRecommendations(
      token
    );

    expect(result).toEqual([fallbackPost]);
    expect(mockedPost.find).toHaveBeenCalledTimes(1);
    expect(mockedPost.find).toHaveBeenCalledWith({
      isDeleted: false,
      isPublished: true,
      _id: { $nin: [readPostId] },
    });
    expect(fallbackPostQuery.select).toHaveBeenCalledWith(
      POST_RECOMMENDATION_FIELDS
    );
    expect(fallbackPostQuery.limit).toHaveBeenCalledWith(10);
  });

  it("does not mutate reading preference arrays while ranking preferences", async () => {
    const favoriteGenres = [
      { name: "Mystery", count: 1 },
      { name: "Fantasy", count: 3 },
    ];
    const favoriteEmotions = [
      { name: "Calm", count: 1 },
      { name: "Joy", count: 2 },
    ];

    createUserQuery({
      readingPreferences: {
        favoriteGenres,
        favoriteEmotions,
      },
      readingHistory: [],
    });
    createPostQuery(Array(10).fill(createRecommendationPost(readPostId)));

    await RecommendationService.getPersonalizedRecommendations(token);

    expect(favoriteGenres).toEqual([
      { name: "Mystery", count: 1 },
      { name: "Fantasy", count: 3 },
    ]);
    expect(favoriteEmotions).toEqual([
      { name: "Calm", count: 1 },
      { name: "Joy", count: 2 },
    ]);
    expect(mockedPost.find.mock.calls[0][0].$or).toEqual([
      { genre: { $in: ["Fantasy", "Mystery"] } },
      { emotions: { $in: ["Joy", "Calm"] } },
    ]);
  });
});

describe("recommendation query indexes", () => {
  it("registers indexes for published popularity and preference recommendation queries", () => {
    const indexKeys = PostSchema.indexes().map(([keys]) => keys);

    expect(indexKeys).toEqual(
      expect.arrayContaining([
        {
          isPublished: 1,
          isDeleted: 1,
          likesCount: -1,
          viewsCount: -1,
        },
        {
          isPublished: 1,
          isDeleted: 1,
          genre: 1,
          likesCount: -1,
          viewsCount: -1,
        },
        {
          isPublished: 1,
          isDeleted: 1,
          emotions: 1,
          likesCount: -1,
          viewsCount: -1,
        },
      ])
    );
  });
});
