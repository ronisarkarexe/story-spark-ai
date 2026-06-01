"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const post_model_1 = require("../../post/post.model");
const analytics_service_1 = require("../analytics.service");
jest.mock("../../post/post.model", () => ({
    Post: {
        aggregate: jest.fn(),
        find: jest.fn(),
    },
}));
const mockedPost = post_model_1.Post;
const author = new mongoose_1.Types.ObjectId("507f1f77bcf86cd799439011");
const otherAuthor = new mongoose_1.Types.ObjectId("507f1f77bcf86cd799439012");
const token = {
    _id: author.toString(),
    email: "writer@example.com",
    role: "writer",
};
const serverTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const oldHeatmap = (posts) => {
    const heatmap = {};
    posts.forEach((post) => {
        const date = new Date(post.publishedAt || post.createdAt)
            .toISOString()
            .split("T")[0];
        heatmap[date] = (heatmap[date] || 0) + 1;
    });
    return Object.entries(heatmap).map(([date, count]) => ({ date, count }));
};
const oldProductiveHours = (posts) => {
    const hourCount = {};
    for (let i = 0; i < 24; i += 1) {
        hourCount[i] = 0;
    }
    posts.forEach((post) => {
        const hour = new Date(post.publishedAt || post.createdAt).getHours();
        hourCount[hour] += 1;
    });
    return Object.entries(hourCount).map(([hour, count]) => ({
        hour: parseInt(hour, 10),
        count,
    }));
};
const oldMoodTimeline = (posts) => {
    const timeline = {};
    posts.forEach((post) => {
        const month = new Date(post.publishedAt || post.createdAt)
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
    it("getHeatmap uses aggregation and preserves the previous response shape", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const fixtures = [
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
        const expected = oldHeatmap(fixtures).sort((a, b) => a.date.localeCompare(b.date));
        mockedPost.aggregate.mockResolvedValue(expected);
        const result = yield analytics_service_1.AnalyticsService.getHeatmap(token);
        expect(result).toEqual(expected);
        expect(mockedPost.aggregate).toHaveBeenCalledTimes(1);
        expect(mockedPost.find).not.toHaveBeenCalled();
        const pipeline = (_a = mockedPost.aggregate.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
        expect(pipeline).toEqual(expect.arrayContaining([
            expect.objectContaining({ $match: expect.any(Object) }),
            expect.objectContaining({ $project: expect.any(Object) }),
            expect.objectContaining({ $group: expect.any(Object) }),
            expect.objectContaining({ $sort: { date: 1 } }),
        ]));
    }));
    it("getProductiveHours uses aggregation and returns all 24 hour buckets", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const fixtures = [
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
        mockedPost.aggregate.mockResolvedValue(aggregateRows);
        const result = yield analytics_service_1.AnalyticsService.getProductiveHours(token);
        expect(result).toEqual(expected);
        expect(result).toHaveLength(24);
        expect(mockedPost.aggregate).toHaveBeenCalledTimes(1);
        expect(mockedPost.find).not.toHaveBeenCalled();
        const pipeline = (_a = mockedPost.aggregate.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
        expect(pipeline).toEqual(expect.arrayContaining([
            expect.objectContaining({ $match: expect.any(Object) }),
            expect.objectContaining({ $project: expect.any(Object) }),
            expect.objectContaining({ $group: expect.any(Object) }),
            expect.objectContaining({ $sort: { hour: 1 } }),
        ]));
    }));
    it("getProductiveHours groups by the server local timezone used by Date#getHours", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const fixture = {
            author,
            publishedAt: new Date("2026-01-01T00:30:00.000Z"),
        };
        const expected = oldProductiveHours([fixture]);
        const expectedHour = fixture.publishedAt.getHours();
        mockedPost.aggregate.mockResolvedValue([{ hour: expectedHour, count: 1 }]);
        const result = yield analytics_service_1.AnalyticsService.getProductiveHours(token);
        expect(result).toEqual(expected);
        const pipeline = (_a = mockedPost.aggregate.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
        expect(pipeline).toEqual(expect.arrayContaining([
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
        ]));
    }));
    it("getMoodTimeline uses aggregation and preserves month/emotion grouping", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const fixtures = [
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
        mockedPost.aggregate.mockResolvedValue(expected);
        const result = yield analytics_service_1.AnalyticsService.getMoodTimeline(token);
        expect(result).toEqual(expected);
        expect(mockedPost.aggregate).toHaveBeenCalledTimes(1);
        expect(mockedPost.find).not.toHaveBeenCalled();
        const pipeline = (_a = mockedPost.aggregate.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
        expect(pipeline).toEqual(expect.arrayContaining([
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
        ]));
    }));
    it("getMoodTimeline preserves empty month buckets for posts without emotions", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const fixtures = [
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
        mockedPost.aggregate.mockResolvedValue(expected);
        const result = yield analytics_service_1.AnalyticsService.getMoodTimeline(token);
        expect(result).toEqual([
            { month: "2026-03", emotions: {} },
            { month: "2026-04", emotions: {} },
            { month: "2026-05", emotions: { Hope: 1 } },
        ]);
        expect(result).toEqual(expected);
        const pipeline = (_a = mockedPost.aggregate.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[0];
        expect(pipeline).toEqual(expect.arrayContaining([
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
        ]));
    }));
    it("ignores posts from other users in old-logic fixtures used for comparison", () => {
        const fixtures = [
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
