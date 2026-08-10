import { Types } from 'mongoose';
import { Post } from '../../post/post.model';
import { User } from '../../user/user.model';
import { RecommendationService } from '../recommendation.service';
import { ITokenPayload } from '../../../../interfaces/token';

jest.mock('../../post/post.model', () => {
  const actual = jest.requireActual('../../post/post.model');
  return {
    ...actual,
    Post: {
      find: jest.fn(),
    },
  };
});

jest.mock('../../user/user.model', () => ({
  User: {
    findById: jest.fn(),
  },
}));

const mockedPost = Post as unknown as { find: jest.Mock };
const mockedUser = User as unknown as { findById: jest.Mock };

const userId = new Types.ObjectId('507f1f77bcf86cd799439011');
const token = {
  _id: userId.toString(),
  email: 'test@example.com',
  role: 'user',
} as ITokenPayload;

describe('RecommendationService Fallback Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should run fallback query when user has no preferences', async () => {
    const userQuery = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({
        _id: userId,
        readingPreferences: null,
        readingHistory: [],
      }),
    };
    mockedUser.findById.mockReturnValue(userQuery);

    const postQuery = {
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([
        { _id: new Types.ObjectId(), title: 'Popular Post 1' },
      ]),
    };
    mockedPost.find.mockReturnValue(postQuery);

    const result = await RecommendationService.getPersonalizedRecommendations(token);

    expect(mockedUser.findById).toHaveBeenCalledWith(token._id);
    expect(mockedPost.find).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(1);
  });
});
