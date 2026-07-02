import { model, Schema } from "mongoose";
import {
  ICharacter,
  ILocation,
  IObject,
  IRelationship,
  IStoryBible,
  ITimelineEvent,
} from "./story_bible.interface";

const CharacterSchema = new Schema<ICharacter>({
  id: { type: String },
  name: { type: String, required: true },
  role: { type: String, default: "" },
  physicalTraits: { type: String, default: "" },
  personality: { type: String, default: "" },
  background: { type: String, default: "" },
  notes: { type: String, default: "" },
});

const LocationSchema = new Schema<ILocation>({
  id: { type: String },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  history: { type: String, default: "" },
  notes: { type: String, default: "" },
});

const ObjectSchema = new Schema<IObject>({
  id: { type: String },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  significance: { type: String, default: "" },
  notes: { type: String, default: "" },
});

const RelationshipSchema = new Schema<IRelationship>({
  id: { type: String },
  character1: { type: String, required: true },
  character2: { type: String, required: true },
  relationshipType: { type: String, default: "" },
  dynamics: { type: String, default: "" },
});

const TimelineEventSchema = new Schema<ITimelineEvent>({
  id: { type: String },
  dateOrTime: { type: String, required: true },
  description: { type: String, required: true },
  charactersInvolved: [{ type: String }],
});

const StoryBibleSchema = new Schema<IStoryBible>(
  {
    storyId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    characters: [CharacterSchema],
    locations: [LocationSchema],
    objects: [ObjectSchema],
    relationships: [RelationshipSchema],
    timelineEvents: [TimelineEventSchema],
  },
  {
    timestamps: true,
  }
);

export const StoryBible = model<IStoryBible>("StoryBible", StoryBibleSchema);
