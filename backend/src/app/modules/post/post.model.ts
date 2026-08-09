import { model, Schema } from "mongoose";
import { IPost, PostModel } from "./post.interface";

export const PostSchema: Schema<IPost, PostModel> = new Schema<IPost, PostModel>(
  {
    title: { type: String, required: true, maxlength: 200 },
    content: { type: String, required: true, maxlength: 50000 },
    tag: { type: String, required: true, maxlength: 50 },
    imageURL: { type: String, required: true, maxlength: 2000 },
    language: { type: String, default: "English", maxlength: 50 },
    emotions: [{ type: String, maxlength: 50 }],
    genre: { type: String, maxlength: 50 },
    topic: [
      {
        title: { type: String, required: true, maxlength: 50 },
        color: { type: String, required: true, maxlength: 50 },
        selected: { type: Boolean, required: true },
      },
    ],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    isFeaturedPost: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    publishedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    attachments: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    reactions: [{ type: Schema.Types.ObjectId, ref: "Reaction" }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "User" }],
    parentStoryId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    rootStoryId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
  },
  {
    timestamps: true,
  }
);

PostSchema.index({ author: 1, publishedAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ author: 1, emotions: 1 });
PostSchema.index({
  isPublished: 1,
  isDeleted: 1,
  likesCount: -1,
  viewsCount: -1,
});
PostSchema.index({
  isPublished: 1,
  isDeleted: 1,
  genre: 1,
  likesCount: -1,
  viewsCount: -1,
});
PostSchema.index({
  isPublished: 1,
  isDeleted: 1,
  emotions: 1,
  likesCount: -1,
  viewsCount: -1,
});

// Full-text search index for unified search feature
PostSchema.index(
  { title: "text", content: "text", tag: "text" },
  {
    name: "title_text_content_text_tag_text",
    weights: { title: 10, tag: 5, content: 1 },
    default_language: "english",
  }
);
PostSchema.index({ createdAt: -1 });

/**
 * Fetches engagement statistics for a given post in a single optimized query.
 * Returns null if the post does not exist.
 */
PostSchema.statics.getEngagementStats = async function (postId) {
  const result = await this.findById(postId, {
    likesCount: 1,
    commentsCount: 1,
    bookmarksCount: 1,
    viewsCount: 1,
    averageRating: 1,
    totalRatings: 1,
  }).lean();

  if (!result) {
    return null;
  }

  return {
    likesCount: result.likesCount,
    commentsCount: result.commentsCount,
    bookmarksCount: result.bookmarksCount,
    viewsCount: result.viewsCount,
    averageRating: result.averageRating,
    totalRatings: result.totalRatings,
  };
};

export const Post = model<IPost, PostModel>("Post", PostSchema);
