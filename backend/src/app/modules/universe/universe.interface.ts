import { Model, Types } from "mongoose";

export interface IUniverse {
  name: string;
  description: string;
  author: Types.ObjectId;
  stories: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type UniverseModel = Model<IUniverse, object>;

export type MemoryType =
  | "character"
  | "relationship"
  | "location"
  | "event"
  | "rule"
  | "magic_system"
  | "object"
  | "other";

export interface IUniverseMemory {
  universeId: Types.ObjectId;
  type: MemoryType;
  title: string;
  content: string;
  attributes?: Record<string, any>;
  tags?: string[];
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UniverseMemoryModel = Model<IUniverseMemory, object>;
