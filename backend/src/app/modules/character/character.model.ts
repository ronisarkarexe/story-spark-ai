import mongoose, { Document, Schema } from "mongoose";

export interface ICharacter extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  archetype: string;
  traits: string[];
  backstory: string;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    archetype: {
      type: String,
      required: true,
      trim: true,
    },
    traits: {
      type: [String],
      default: [],
    },
    backstory: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Character = mongoose.model<ICharacter>("Character", CharacterSchema);