import mongoose, { Schema, Document } from 'mongoose';

export interface ICharacter extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  role?: string;
  age?: number;
  personality: string;
  appearance?: string;
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
    role: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    personality: {
      type: String,
      required: true,
    },
    appearance: {
      type: String,
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