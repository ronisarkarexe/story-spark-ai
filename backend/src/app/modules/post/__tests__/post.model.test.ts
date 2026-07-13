import { Post } from "../post.model";

describe("Post.getEngagementStats", () => {
  const postId = "507f1f77bcf86cd799439011";
  const projection =
    "likesCount commentsCount bookmarksCount viewsCount averageRating totalRatings";

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns all engagement metrics using one projected post query", async () => {
    const lean = jest.fn().mockResolvedValue({
      likesCount: 12,
      commentsCount: 4,
      bookmarksCount: 3,
      viewsCount: 250,
      averageRating: 4.6,
      totalRatings: 8,
    });
    const select = jest.fn().mockReturnValue({ lean });
    const findById = jest.spyOn(Post, "findById").mockReturnValue({ select } as never);

    await expect(Post.getEngagementStats(postId)).resolves.toEqual({
      likesCount: 12,
      commentsCount: 4,
      bookmarksCount: 3,
      viewsCount: 250,
      averageRating: 4.6,
      totalRatings: 8,
    });

    expect(findById).toHaveBeenCalledTimes(1);
    expect(findById).toHaveBeenCalledWith(postId);
    expect(select).toHaveBeenCalledWith(projection);
    expect(lean).toHaveBeenCalledTimes(1);
  });

  it("returns null when the post does not exist", async () => {
    const lean = jest.fn().mockResolvedValue(null);
    const select = jest.fn().mockReturnValue({ lean });
    jest.spyOn(Post, "findById").mockReturnValue({ select } as never);

    await expect(Post.getEngagementStats(postId)).resolves.toBeNull();
  });
});
