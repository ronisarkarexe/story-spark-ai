import mongoose, { Schema, Document } from 'mongoose';

export interface ICharacter extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  age?: number;
  personality: string[];
  appearance: string;
  background?: string;
  traits: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    personality: {
      type: [String],
      default: [],
    },
    appearance: {
      type: String,
      required: true,
    },
    background: {
      type: String,
    },
    traits: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Character = mongoose.model<ICharacter>('Character', CharacterSchema);