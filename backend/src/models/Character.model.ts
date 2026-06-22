import mongoose, { Schema, Document } from "mongoose";

export interface ICharacter extends Document {
  userId: string;
  name: string;
  age?: number;
  personality?: string;
  appearance?: string;
  background?: string;
  traits?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number },
    personality: { type: String },
    appearance: { type: String },
    background: { type: String },
    traits: [{ type: String }],
    notes: { type: String },
  },
  { timestamps: true }
);

export const Character = mongoose.model<ICharacter>("Character", CharacterSchema);
