import { model, Schema } from "mongoose";
import { CommentModel, IComment } from "./comment.interface";

const CommentSchema: Schema<IComment> = new Schema<IComment, CommentModel>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

CommentSchema.index({ postId: 1, parentCommentId: 1 });

export const Comment = model<IComment, CommentModel>("Comment", CommentSchema);
