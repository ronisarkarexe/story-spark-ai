import { Schema, model } from "mongoose";
import { IConsistencyReport, ConsistencyReportModel } from "./consistency.interface";

const CharacterProfileSchema = new Schema({
  name: { type: String, required: true },
  traits: [{ type: String }],
  abilities: [{ type: String }],
  relationships: [
    {
      target: { type: String },
      relationshipType: { type: String },
    },
  ],
}, { _id: false });

const TimelineEventSchema = new Schema({
  chapter: { type: Number, required: true },
  description: { type: String, required: true },
  entitiesInvolved: [{ type: String }],
}, { _id: false });

const ContradictionSchema = new Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  suggestedFix: { type: String },
}, { _id: false });

const ConsistencyReportSchema = new Schema<IConsistencyReport, ConsistencyReportModel>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    score: { type: Number, required: true, default: 100 },
    characters: [CharacterProfileSchema],
    timeline: [TimelineEventSchema],
    contradictions: [ContradictionSchema],
  },
  { timestamps: true }
);

export const ConsistencyReport = model<IConsistencyReport, ConsistencyReportModel>("ConsistencyReport", ConsistencyReportSchema);
