import { model, Schema } from "mongoose";
import { IPost, PostModel } from "./post.interface";

export const PostSchema: Schema<IPost> = new Schema<IPost, PostModel>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, required: true },
    imageURL: { type: String, required: true },
    language: { type: String, default: "English" },
    emotions: [{ type: String }],
    genre: { type: String },
    topic: [
      {
        title: { type: String, required: true },
        color: { type: String, required: true },
        selected: { type: Boolean, required: true },
      },
    ],
    author: { type: Schema.Types.ObjectId, ref: "User" },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
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
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  {
    timestamps: true,
  }
);

PostSchema.index({ author: 1, publishedAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ author: 1, emotions: 1 });

export const Post = model<IPost, PostModel>("Post", PostSchema);
