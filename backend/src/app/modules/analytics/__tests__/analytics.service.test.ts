import { Types } from "mongoose";
import { Post } from "../../post/post.model";
import { AnalyticsService } from "../analytics.service";
import { ITokenPayload } from "../../../../interfaces/token";

jest.mock("../../post/post.model", () => ({
  Post: {
    aggregate: jest.fn(),
    find: jest.fn(),
  },
}));

const mockedPost = Post as jest.Mocked<typeof Post>;

type AnalyticsPostFixture = {
  author: Types.ObjectId;
  publishedAt?: Date;
  createdAt?: Date;
  emotions?: string[];
};

const author = new Types.ObjectId("507f1f77bcf86cd799439011");
const otherAuthor = new Types.ObjectId("507f1f77bcf86cd799439012");

const token = {
  _id: author.toString(),
  email: "writer@example.com",
  role: "writer",
} as ITokenPayload;

const serverTimeZone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const oldHeatmap = (posts: AnalyticsPostFixture[]) => {
  const heatmap: Record<string, number> = {};

  posts.forEach((post) => {
    const date = new Date(post.publishedAt || post.createdAt!)
      .toISOString()
      .split("T")[0];
    heatmap[date] = (heatmap[date] || 0) + 1;
  });

  return Object.entries(heatmap).map(([date, count]) => ({ date, count }));
};

const oldProductiveHours = (posts: AnalyticsPostFixture[]) => {
  const hourCount: Record<number, number> = {};
  for (let i = 0; i < 24; i += 1) {
    hourCount[i] = 0;
  }

  posts.forEach((post) => {
    const hour = new Date(post.publishedAt || post.createdAt!).getHours();
    hourCount[hour] += 1;
  });

  return Object.entries(hourCount).map(([hour, count]) => ({
    hour: parseInt(hour, 10),
    count,
  }));
};

const oldMoodTimeline = (posts: AnalyticsPostFixture[]) => {
  const timeline: Record<string, Record<string, number>> = {};

  posts.forEach((post) => {
    const month = new Date(post.publishedAt || post.createdAt!)
      .toISOString()
      .slice(0, 7);

    if (!timeline[month]) {
      timeline[month] = {};
    }

    if (post.emotions && Array.isArray(post.emotions)) {
      post.emotions.forEach((emotion) => {
        timeline[month][emotion] = (timeline[month][emotion] || 0) + 1;
      });
    }
  });

  return Object.entries(timeline)
    .map(([month, emotions]) => ({
      month,
      emotions,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

describe("AnalyticsService aggregation endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.ANALYTICS_BENCHMARK;
  });

  it("getHeatmap uses aggregation and preserves the previous response shape", async () => {
    const fixtures: AnalyticsPostFixture[] = [
      {
        author,
        publishedAt: new Date("2026-01-01T10:00:00.000Z"),
      },
      {
        author,
        publishedAt: new Date("2026-01-01T12:00:00.000Z"),
      },
      {
        author,
        publishedAt: new Date("2026-01-02T12:00:00.000Z"),
      },
    ];
    const expected = oldHeatmap(fixtures).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    mockedPost.aggregate.mockResolvedValue(expected as never);

    const result = await AnalyticsService.getHeatmap(token);

    expect(result).toEqual(expected);
    expect(mockedPost.aggregate).toHaveBeenCalledTimes(1);
    expect(mockedPost.find).not.toHaveBeenCalled();

    const pipeline = mockedPost.aggregate.mock.calls[0]?.[0] as unknown[];
    expect(pipeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ $match: expect.any(Object) }),
        expect.objectContaining({ $project: expect.any(Object) }),
        expect.objectContaining({ $group: expect.any(Object) }),
        expect.objectContaining({ $sort: { date: 1 } }),
      ])
    );
  });

  it("getProductiveHours uses aggregation and returns all 24 hour buckets", async () => {
    const fixtures: AnalyticsPostFixture[] = [
      {
        author,
        publishedAt: new Date("2026-01-01T01:00:00.000Z"),
      },
      {
        author,
        publishedAt: new Date("2026-01-01T01:30:00.000Z"),
      },
      {
        author,
        publishedAt: new Date("2026-01-01T05:00:00.000Z"),
      },
    ];
    const expected = oldProductiveHours(fixtures);
    const aggregateRows = expected.filter((item) => item.count > 0);
    mockedPost.aggregate.mockResolvedValue(aggregateRows as never);

    const result = await AnalyticsService.getProductiveHours(token);

    expect(result).toEqual(expected);
    expect(result).toHaveLength(24);
    expect(mockedPost.aggregate).toHaveBeenCalledTimes(1);
    expect(mockedPost.find).not.toHaveBeenCalled();

    const pipeline = mockedPost.aggregate.mock.calls[0]?.[0] as unknown[];
    expect(pipeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ $match: expect.any(Object) }),
        expect.objectContaining({ $project: expect.any(Object) }),
        expect.objectContaining({ $group: expect.any(Object) }),
        expect.objectContaining({ $sort: { hour: 1 } }),
      ])
    );
  });

  it("getProductiveHours groups by the server local timezone used by Date#getHours", async () => {
    const fixture: AnalyticsPostFixture = {
      author,
      publishedAt: new Date("2026-01-01T00:30:00.000Z"),
    };
    const expected = oldProductiveHours([fixture]);
    const expectedHour = fixture.publishedAt!.getHours();

    mockedPost.aggregate.mockResolvedValue(
      [{ hour: expectedHour, count: 1 }] as never
    );

    const result = await AnalyticsService.getProductiveHours(token);

    expect(result).toEqual(expected);

    const pipeline = mockedPost.aggregate.mock.calls[0]?.[0] as unknown[];
    expect(pipeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          $project: {
            hour: {
              $hour: {
                date: { $ifNull: ["$publishedAt", "$createdAt"] },
                timezone: serverTimeZone,
              },
            },
          },
        }),
      ])
    );
  });

  it("getMoodTimeline uses aggregation and preserves month/emotion grouping", async () => {
    const fixtures: AnalyticsPostFixture[] = [
      {
        author,
        publishedAt: new Date("2026-01-01T00:00:00.000Z"),
        emotions: ["Joy", "Mystery"],
      },
      {
        author,
        publishedAt: new Date("2026-01-15T00:00:00.000Z"),
        emotions: ["Joy"],
      },
      {
        author,
        publishedAt: new Date("2026-02-01T00:00:00.000Z"),
        emotions: ["Suspense"],
      },
    ];
    const expected = oldMoodTimeline(fixtures);
    mockedPost.aggregate.mockResolvedValue(expected as never);

    const result = await AnalyticsService.getMoodTimeline(token);

    expect(result).toEqual(expected);
    expect(mockedPost.aggregate).toHaveBeenCalledTimes(1);
    expect(mockedPost.find).not.toHaveBeenCalled();

    const pipeline = mockedPost.aggregate.mock.calls[0]?.[0] as unknown[];
    expect(pipeline).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ $match: expect.any(Object) }),
        expect.objectContaining({ $project: expect.any(Object) }),
        {
          $unwind: {
            path: "$emotions",
            preserveNullAndEmptyArrays: true,
          },
        },
        expect.objectContaining({ $group: expect.any(Object) }),
        expect.objectContaining({ $sort: { month: 1 } }),
      ])
    );
  });

  it("getMoodTimeline preserves empty month buckets for posts without emotions", async () => {
    const fixtures: AnalyticsPostFixture[] = [
      {
        author,
        publishedAt: new Date("2026-03-01T00:00:00.000Z"),
        emotions: [],
      },
      {
        author,
        publishedAt: new Date("2026-04-01T00:00:00.000Z"),
      },
      {
        author,
        publishedAt: new Date("2026-05-01T00:00:00.000Z"),
        emotions: ["Hope"],
      },
    ];
    const expected = oldMoodTimeline(fixtures);
    mockedPost.aggregate.mockResolvedValue(expected as never);

    const result = await AnalyticsService.getMoodTimeline(token);

    expect(result).toEqual([
      { month: "2026-03", emotions: {} },
      { month: "2026-04", emotions: {} },
      { month: "2026-05", emotions: { Hope: 1 } },
    ]);
    expect(result).toEqual(expected);

    const pipeline = mockedPost.aggregate.mock.calls[0]?.[0] as unknown[];
    expect(pipeline).toEqual(
      expect.arrayContaining([
        {
          $unwind: {
            path: "$emotions",
            preserveNullAndEmptyArrays: true,
          },
        },
        expect.objectContaining({
          $project: expect.objectContaining({
            emotions: expect.objectContaining({
              $arrayToObject: expect.any(Object),
            }),
          }),
        }),
      ])
    );
  });

  it("ignores posts from other users in old-logic fixtures used for comparison", () => {
    const fixtures: AnalyticsPostFixture[] = [
      {
        author,
        publishedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
      {
        author: otherAuthor,
        publishedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    ];

    const userFixtures = fixtures.filter((post) => post.author.equals(author));

    expect(oldHeatmap(userFixtures)).toEqual([
      { date: "2026-01-01", count: 1 },
    ]);
  });
});
