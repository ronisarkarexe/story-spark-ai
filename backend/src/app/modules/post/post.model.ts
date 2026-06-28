import { model, Schema } from "mongoose";
import { IPost, PostModel } from "./post.interface";

export const PostSchema: Schema<IPost> = new Schema<IPost, PostModel>(
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
    branchDepth: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

PostSchema.pre("save", function (next) {
  if (!this.rootStoryId) {
    this.rootStoryId = this._id;
  }
  next();
});

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

export const Post = model<IPost, PostModel>("Post", PostSchema);