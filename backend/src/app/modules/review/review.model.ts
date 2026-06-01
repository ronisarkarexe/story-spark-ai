import { model, Schema } from "mongoose";
import { IReview, ReviewModel } from "./review.interface";

const ReviewSchema = new Schema<IReview, ReviewModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    feedback: {
      type: String,
      required: true,
    },

    imgSrc: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 5,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = model<IReview, ReviewModel>(
  "Review",
  ReviewSchema
);
