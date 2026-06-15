import { Schema, model, Document } from "mongoose";

// 1. TypeScript Interface defining the structure
export interface ICharacter extends Document {
  userId: Schema.Types.ObjectId; // Links the character to the user who created it
  name: string;
  archetype: string;             // e.g., "The Rebel", "The Mentor", "The Anti-Hero"
  backstory: string;
  personalityTraits: string[];   // e.g., ["witty", "courageous", "secretive"]
  abilitiesOrSkills: string[];
  aiPromptContext?: string;      // Extra context used when feeding this character to the AI storyteller
  createdAt: Date;
}

// 2. Mongoose Schema
const CharacterSchema = new Schema<ICharacter>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Character name is required"],
      trim: true,
    },
    archetype: {
      type: String,
      required: [true, "Character archetype is required"],
      trim: true,
    },
    backstory: {
      type: String,
      required: [true, "Backstory is required"],
    },
    personalityTraits: {
      type: [String],
      default: [],
    },
    abilitiesOrSkills: {
      type: [String],
      default: [],
    },
    aiPromptContext: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt fields
  }
);

// 3. Export the Model
const Character = model<ICharacter>("Character", CharacterSchema);
export default Character;