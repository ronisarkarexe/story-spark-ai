import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { Post } from "../post/post.model";
import { IUniverse, IUniverseMemory } from "./universe.interface";
import { Universe, UniverseMemory } from "./universe.model";

const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const createUniverse = async (authorId: string, payload: IUniverse): Promise<IUniverse> => {
  const universe = await Universe.create({ ...payload, author: authorId });

  // Update associated stories if any
  if (payload.stories && payload.stories.length > 0) {
    await Post.updateMany(
      { _id: { $in: payload.stories }, author: authorId },
      { universeId: universe._id }
    );
  }

  return universe;
};

const getAllUniverses = async (authorId: string): Promise<IUniverse[]> => {
  return await Universe.find({ author: authorId }).populate("stories");
};

const getUniverseById = async (universeId: string, authorId: string): Promise<IUniverse> => {
  const universe = await Universe.findOne({ _id: universeId, author: authorId }).populate("stories");
  if (!universe) {
    throw new ApiError(httpStatus.NOT_FOUND, "Universe not found!");
  }
  return universe;
};

const updateUniverse = async (
  universeId: string,
  authorId: string,
  payload: Partial<IUniverse>
): Promise<IUniverse | null> => {
  const universe = await Universe.findOne({ _id: universeId, author: authorId });
  if (!universe) {
    throw new ApiError(httpStatus.NOT_FOUND, "Universe not found!");
  }

  // Handle stories updating
  if (payload.stories) {
    // Unlink old stories first
    await Post.updateMany(
      { universeId: universe._id },
      { universeId: null }
    );
    // Link new stories
    await Post.updateMany(
      { _id: { $in: payload.stories }, author: authorId },
      { universeId: universe._id }
    );
  }

  const updated = await Universe.findOneAndUpdate(
    { _id: universeId, author: authorId },
    payload,
    { new: true }
  ).populate("stories");

  return updated;
};

const deleteUniverse = async (universeId: string, authorId: string): Promise<void> => {
  const universe = await Universe.findOne({ _id: universeId, author: authorId });
  if (!universe) {
    throw new ApiError(httpStatus.NOT_FOUND, "Universe not found!");
  }

  // Unlink posts
  await Post.updateMany({ universeId: universe._id }, { universeId: null });

  // Delete all memories
  await UniverseMemory.updateMany({ universeId: universe._id }, { isDeleted: true });

  await Universe.deleteOne({ _id: universeId });
};

// Memory (Lore) methods
const createMemory = async (
  universeId: string,
  createdBy: string,
  payload: IUniverseMemory
): Promise<IUniverseMemory> => {
  const universe = await Universe.findOne({ _id: universeId, author: createdBy });
  if (!universe) {
    throw new ApiError(httpStatus.NOT_FOUND, "Universe not found or unauthorized.");
  }

  return await UniverseMemory.create({
    ...payload,
    universeId,
    createdBy,
    isDeleted: false,
  });
};

const getMemories = async (
  universeId: string,
  createdBy: string,
  query: { type?: string; searchTerm?: string }
): Promise<IUniverseMemory[]> => {
  const universe = await Universe.findOne({ _id: universeId, author: createdBy });
  if (!universe) {
    throw new ApiError(httpStatus.NOT_FOUND, "Universe not found or unauthorized.");
  }

  const filter: any = { universeId, isDeleted: false };
  if (query.type) {
    filter.type = query.type;
  }

  if (query.searchTerm) {
    filter.$or = [
      { title: { $regex: query.searchTerm, $options: "i" } },
      { content: { $regex: query.searchTerm, $options: "i" } },
    ];
  }

  return await UniverseMemory.find(filter).sort({ title: 1 });
};

const updateMemory = async (
  universeId: string,
  memoryId: string,
  createdBy: string,
  payload: Partial<IUniverseMemory>
): Promise<IUniverseMemory | null> => {
  const universe = await Universe.findOne({ _id: universeId, author: createdBy });
  if (!universe) {
    throw new ApiError(httpStatus.NOT_FOUND, "Universe not found or unauthorized.");
  }

  const updated = await UniverseMemory.findOneAndUpdate(
    { _id: memoryId, universeId, isDeleted: false },
    payload,
    { new: true }
  );

  if (!updated) {
    throw new ApiError(httpStatus.NOT_FOUND, "Memory entry not found!");
  }

  return updated;
};

const deleteMemory = async (
  universeId: string,
  memoryId: string,
  createdBy: string
): Promise<void> => {
  const universe = await Universe.findOne({ _id: universeId, author: createdBy });
  if (!universe) {
    throw new ApiError(httpStatus.NOT_FOUND, "Universe not found or unauthorized.");
  }

  const result = await UniverseMemory.updateOne(
    { _id: memoryId, universeId },
    { isDeleted: true }
  );

  if (result.matchedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Memory entry not found!");
  }
};

const retrieveLore = async (
  universeId: string,
  queryText: string
): Promise<IUniverseMemory[]> => {
  if (!queryText || queryText.trim().length === 0) {
    return [];
  }

  // Load all active memories in this universe
  const memories = await UniverseMemory.find({ universeId, isDeleted: false });

  // Filter based on whether queryText matches the memory title (case insensitive)
  const matched = memories.filter((memory) => {
    try {
      const titleRegex = new RegExp(`\\b${escapeRegExp(memory.title)}\\b`, "i");
      return titleRegex.test(queryText);
    } catch {
      // Fallback in case title is not clean regex
      return queryText.toLowerCase().includes(memory.title.toLowerCase());
    }
  });

  return matched;
};

export const UniverseService = {
  createUniverse,
  getAllUniverses,
  getUniverseById,
  updateUniverse,
  deleteUniverse,
  createMemory,
  getMemories,
  updateMemory,
  deleteMemory,
  retrieveLore,
};
