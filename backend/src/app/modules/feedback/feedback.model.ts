import mongoose, { Schema } from "mongoose";
import { IFeedback } from "./feedback.interface";

const feedbackSchema = new Schema<IFeedback>(
  {
    fullname: { type: String },
    email: { type: String },
    type: { type: String, enum: ["bug", "feature", "general"], required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model<IFeedback>("Feedback", feedbackSchema);
