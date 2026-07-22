// Tests for the atomic Post stat-sync fix in StoryRatingService (#3875).
// All MongoDB models are mocked so the suite is fully in-process.

const mockPostFindById = jest.fn();
const mockPostFindByIdAndUpdate = jest.fn();
const mockRatingFindOne = jest.fn();
const mockRatingFindOneAndUpdate = jest.fn();
const mockRatingFindById = jest.fn();
const mockRatingFindByIdAndDelete = jest.fn();

jest.mock('../app/modules/post/post.model', () => ({
  Post: {
    findById: (...a: unknown[]) => mockPostFindById(...a),
    findByIdAndUpdate: (...a: unknown[]) => mockPostFindByIdAndUpdate(...a),
  },
}));

jest.mock('../app/modules/story_rating/story_rating.model', () => ({
  StoryRating: {
    findOne: (...a: unknown[]) => mockRatingFindOne(...a),
    findOneAndUpdate: (...a: unknown[]) => mockRatingFindOneAndUpdate(...a),
    findById: (...a: unknown[]) => mockRatingFindById(...a),
    findByIdAndDelete: (...a: unknown[]) => mockRatingFindByIdAndDelete(...a),
  },
}));

jest.mock('../errors/api_error', () =>
  class ApiError extends Error {
    constructor(public status: number, message: string) { super(message); }
  }
);

import { StoryRatingService } from '../app/modules/story_rating/story_rating.service';
import { Types } from 'mongoose';

const STORY_ID = new Types.ObjectId().toString();
const USER_ID  = new Types.ObjectId().toString();
const RATING_ID = new Types.ObjectId().toString();

function fakePost(authorId = new Types.ObjectId().toString()) {
  return { _id: STORY_ID, author: new Types.ObjectId(authorId) };
}

beforeEach(() => jest.clearAllMocks());

// ── rateStory ─────────────────────────────────────────────────────────────────

describe('rateStory — atomic stat sync', () => {
  it('uses a pipeline update (array) on Post — never a plain object snapshot', async () => {
    mockPostFindById.mockResolvedValue(fakePost());
    mockRatingFindOne.mockResolvedValue(null);                          // new rating
    mockRatingFindOneAndUpdate.mockResolvedValue({ rating: 4 });
    mockPostFindByIdAndUpdate.mockResolvedValue({});

    await StoryRatingService.rateStory(USER_ID, STORY_ID, 4);

    expect(mockPostFindByIdAndUpdate).toHaveBeenCalledTimes(1);
    const [, updateArg] = mockPostFindByIdAndUpdate.mock.calls[0];
    // An aggregation-pipeline update is an Array, not a plain object.
    expect(Array.isArray(updateArg)).toBe(true);
  });

  it('increments totalRatings by +1 and ratingSum by the full rating on first insert', async () => {
    mockPostFindById.mockResolvedValue(fakePost());
    mockRatingFindOne.mockResolvedValue(null);                          // new rating
    mockRatingFindOneAndUpdate.mockResolvedValue({ rating: 3 });
    mockPostFindByIdAndUpdate.mockResolvedValue({});

    await StoryRatingService.rateStory(USER_ID, STORY_ID, 3);

    const [, pipeline] = mockPostFindByIdAndUpdate.mock.calls[0] as [unknown, object[]];
    const firstStage = pipeline[0] as { $set: Record<string, unknown> };
    // totalRatings should be incremented by 1
    expect(JSON.stringify(firstStage.$set.totalRatings)).toContain('1');
    // ratingSum delta should include 3 (the rating value)
    expect(JSON.stringify(firstStage.$set.ratingSum)).toContain('3');
  });

  it('keeps totalRatings unchanged and adjusts ratingSum by diff on update', async () => {
    mockPostFindById.mockResolvedValue(fakePost());
    // Existing rating was 2; new rating is 5 → ratingSum delta = +3
    mockRatingFindOne.mockResolvedValue({ rating: 2 });
    mockRatingFindOneAndUpdate.mockResolvedValue({ rating: 5 });
    mockPostFindByIdAndUpdate.mockResolvedValue({});

    await StoryRatingService.rateStory(USER_ID, STORY_ID, 5);

    const [, pipeline] = mockPostFindByIdAndUpdate.mock.calls[0] as [unknown, object[]];
    const firstStage = pipeline[0] as { $set: Record<string, unknown> };
    // totalRatings delta must be 0 (no new document was inserted)
    expect(JSON.stringify(firstStage.$set.totalRatings)).toContain('0');
    // ratingSum delta = 5 - 2 = 3
    expect(JSON.stringify(firstStage.$set.ratingSum)).toContain('3');
  });

  it('does NOT call getAverageRating (no separate aggregation pass)', async () => {
    // If getAverageRating were called it would invoke StoryRating.aggregate —
    // which is not mocked here, so the test would throw if it fires.
    mockPostFindById.mockResolvedValue(fakePost());
    mockRatingFindOne.mockResolvedValue(null);
    mockRatingFindOneAndUpdate.mockResolvedValue({ rating: 5 });
    mockPostFindByIdAndUpdate.mockResolvedValue({});

    await expect(
      StoryRatingService.rateStory(USER_ID, STORY_ID, 5)
    ).resolves.not.toThrow();
  });

  it('calls findOneAndUpdate exactly once on Post (not twice)', async () => {
    mockPostFindById.mockResolvedValue(fakePost());
    mockRatingFindOne.mockResolvedValue(null);
    mockRatingFindOneAndUpdate.mockResolvedValue({ rating: 4 });
    mockPostFindByIdAndUpdate.mockResolvedValue({});

    await StoryRatingService.rateStory(USER_ID, STORY_ID, 4);

    expect(mockPostFindByIdAndUpdate).toHaveBeenCalledTimes(1);
  });

  it('throws FORBIDDEN when user tries to rate their own story', async () => {
    mockPostFindById.mockResolvedValue(fakePost(USER_ID)); // author === userId

    await expect(
      StoryRatingService.rateStory(USER_ID, STORY_ID, 5)
    ).rejects.toThrow('You cannot rate your own story');

    expect(mockPostFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('throws NOT_FOUND when story does not exist', async () => {
    mockPostFindById.mockResolvedValue(null);

    await expect(
      StoryRatingService.rateStory(USER_ID, STORY_ID, 3)
    ).rejects.toThrow('Story not found');
  });
});

// ── deleteRating ──────────────────────────────────────────────────────────────

describe('deleteRating — atomic stat sync', () => {
  it('decrements totalRatings by -1 and ratingSum by the deleted rating value', async () => {
    mockRatingFindById.mockResolvedValue({
      _id: RATING_ID,
      userId: new Types.ObjectId(USER_ID),
      storyId: new Types.ObjectId(STORY_ID),
      rating: 4,
    });
    mockRatingFindByIdAndDelete.mockResolvedValue({});
    mockPostFindByIdAndUpdate.mockResolvedValue({});

    await StoryRatingService.deleteRating(USER_ID, RATING_ID);

    expect(mockPostFindByIdAndUpdate).toHaveBeenCalledTimes(1);
    const [, pipeline] = mockPostFindByIdAndUpdate.mock.calls[0] as [unknown, object[]];
    const firstStage = pipeline[0] as { $set: Record<string, unknown> };
    expect(Array.isArray(pipeline)).toBe(true);
    // totalRatings delta = -1
    expect(JSON.stringify(firstStage.$set.totalRatings)).toContain('-1');
    // ratingSum delta = -4
    expect(JSON.stringify(firstStage.$set.ratingSum)).toContain('-4');
  });

  it('uses a pipeline update on Post (no separate aggregate)', async () => {
    mockRatingFindById.mockResolvedValue({
      _id: RATING_ID,
      userId: new Types.ObjectId(USER_ID),
      storyId: new Types.ObjectId(STORY_ID),
      rating: 2,
    });
    mockRatingFindByIdAndDelete.mockResolvedValue({});
    mockPostFindByIdAndUpdate.mockResolvedValue({});

    await StoryRatingService.deleteRating(USER_ID, RATING_ID);

    const [, updateArg] = mockPostFindByIdAndUpdate.mock.calls[0];
    expect(Array.isArray(updateArg)).toBe(true);
  });

  it('throws NOT_FOUND when rating does not exist', async () => {
    mockRatingFindById.mockResolvedValue(null);

    await expect(
      StoryRatingService.deleteRating(USER_ID, RATING_ID)
    ).rejects.toThrow('Rating not found');

    expect(mockPostFindByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('throws FORBIDDEN when user does not own the rating', async () => {
    const otherUser = new Types.ObjectId().toString();
    mockRatingFindById.mockResolvedValue({
      _id: RATING_ID,
      userId: new Types.ObjectId(otherUser),
      storyId: new Types.ObjectId(STORY_ID),
      rating: 3,
    });

    await expect(
      StoryRatingService.deleteRating(USER_ID, RATING_ID)
    ).rejects.toThrow('You are not authorized to delete this rating');

    expect(mockPostFindByIdAndUpdate).not.toHaveBeenCalled();
  });
});