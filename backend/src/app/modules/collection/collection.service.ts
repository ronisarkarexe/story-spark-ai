import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { User } from "../user/user.model";
import { Post } from "../post/post.model";
import httpStatus from "http-status";
import { Collection } from "./collection.model";
import { Types } from "mongoose";
import { ICollection } from "./collection.interface";

const MAX_STORIES_PER_COLLECTION = 100;
const MAX_COLLECTIONS_PER_USER = 50;

/** ── Create ─────────────────────────────────────────────────────────────── */
const createCollection = async (
  payload: Partial<ICollection>,
  token: ITokenPayload
) => {
  const user = await User.findOne({ email: token.email });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");

  const existing = await Collection.countDocuments({
    ownerId: user._id,
    isDeleted: { $ne: true },
  });
  if (existing >= MAX_COLLECTIONS_PER_USER) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can have at most ${MAX_COLLECTIONS_PER_USER} collections.`
    );
  }

  const collection = await Collection.create({
    ownerId: user._id,
    title: payload.title,
    description: payload.description,
    coverImageUrl: payload.coverImageUrl,
    visibility: payload.visibility ?? "public",
    storyIds: [],
  });

  return collection;
};

/** ── Update metadata / reorder ──────────────────────────────────────────── */
const updateCollection = async (
  collectionId: string,
  payload: Partial<ICollection>,
  token: ITokenPayload
) => {
  const user = await User.findOne({ email: token.email });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");

  const collection = await Collection.findOne({
    _id: collectionId,
    isDeleted: { $ne: true },
  });
  if (!collection) throw new ApiError(httpStatus.NOT_FOUND, "Collection not found!");

  if (collection.ownerId.toString() !== user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not own this collection.");
  }

  const allowed: (keyof ICollection)[] = [
    "title",
    "description",
    "coverImageUrl",
    "visibility",
    "storyIds",
  ];
  allowed.forEach((key) => {
    if (payload[key] !== undefined) {
      (collection as any)[key] = payload[key];
    }
  });

  await collection.save();
  return collection;
};

/** ── Get a single collection (public or owner) ──────────────────────────── */
const getCollectionById = async (
  collectionId: string,
  token: ITokenPayload | null
) => {
  const collection = await Collection.findOne({
    _id: collectionId,
    isDeleted: { $ne: true },
  }).populate({
    path: "storyIds",
    match: { isDeleted: { $ne: true }, isPublished: true },
    populate: { path: "author", select: "name _id" },
    select: "title imageURL tag author likesCount commentsCount createdAt",
  });

  if (!collection) throw new ApiError(httpStatus.NOT_FOUND, "Collection not found!");

  if (collection.visibility === "private") {
    if (!token) throw new ApiError(httpStatus.FORBIDDEN, "This collection is private.");
    const user = await User.findOne({ email: token.email });
    if (!user || collection.ownerId.toString() !== user._id.toString()) {
      throw new ApiError(httpStatus.FORBIDDEN, "This collection is private.");
    }
  }

  return collection;
};

/** ── List a user's collections ──────────────────────────────────────────── */
const getUserCollections = async (
  userId: string,
  requestToken: ITokenPayload | null
) => {
  const isOwner =
    requestToken !== null &&
    (await User.findOne({ email: requestToken.email }).then(
      (u) => u?._id?.toString() === userId
    ));

  const filter: Record<string, unknown> = {
    ownerId: new Types.ObjectId(userId),
    isDeleted: { $ne: true },
  };

  if (!isOwner) {
    filter.visibility = "public";
  }

  const collections = await Collection.find(filter)
    .sort({ createdAt: -1 })
    .populate({
      path: "storyIds",
      match: { isDeleted: { $ne: true }, isPublished: true },
      select: "title imageURL",
      options: { limit: 3 },
    });

  return collections;
};

/** ── Add a story to a collection ────────────────────────────────────────── */
const addStoryToCollection = async (
  collectionId: string,
  storyId: string,
  token: ITokenPayload
) => {
  const user = await User.findOne({ email: token.email });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");

  const collection = await Collection.findOne({
    _id: collectionId,
    isDeleted: { $ne: true },
  });
  if (!collection) throw new ApiError(httpStatus.NOT_FOUND, "Collection not found!");

  if (collection.ownerId.toString() !== user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not own this collection.");
  }

  // Validate storyId is a well-formed ObjectId before using it in a query
  if (!Types.ObjectId.isValid(storyId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid story ID.");
  }

  // Only the collection owner's published stories can be added
  const post = await Post.findOne({
    _id: new Types.ObjectId(storyId),
    author: user._id,
    isPublished: true,
    isDeleted: { $ne: true },
  });
  if (!post) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Story not found or you are not its author."
    );
  }

  const storyObjectId = new Types.ObjectId(storyId);
  const alreadyIn = collection.storyIds.some(
    (id) => id.toString() === storyObjectId.toString()
  );
  if (alreadyIn) {
    throw new ApiError(httpStatus.CONFLICT, "Story is already in this collection.");
  }

  if (collection.storyIds.length >= MAX_STORIES_PER_COLLECTION) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `A collection can have at most ${MAX_STORIES_PER_COLLECTION} stories.`
    );
  }

  collection.storyIds.push(storyObjectId);
  await collection.save();

  return collection;
};

/** ── Remove a story from a collection ───────────────────────────────────── */
const removeStoryFromCollection = async (
  collectionId: string,
  storyId: string,
  token: ITokenPayload
) => {
  const user = await User.findOne({ email: token.email });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");

  // Validate storyId is a well-formed ObjectId before using it in a filter
  if (!Types.ObjectId.isValid(storyId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid story ID.");
  }

  const collection = await Collection.findOne({
    _id: collectionId,
    isDeleted: { $ne: true },
  });
  if (!collection) throw new ApiError(httpStatus.NOT_FOUND, "Collection not found!");

  if (collection.ownerId.toString() !== user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not own this collection.");
  }

  const before = collection.storyIds.length;
  collection.storyIds = collection.storyIds.filter(
    (id) => id.toString() !== storyId
  );
  if (collection.storyIds.length === before) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story not found in this collection.");
  }

  await collection.save();
  return collection;
};

/** ── Delete a collection (soft-delete) ──────────────────────────────────── */
const deleteCollection = async (
  collectionId: string,
  token: ITokenPayload
) => {
  const user = await User.findOne({ email: token.email });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");

  const collection = await Collection.findOne({
    _id: collectionId,
    isDeleted: { $ne: true },
  });
  if (!collection) throw new ApiError(httpStatus.NOT_FOUND, "Collection not found!");

  if (collection.ownerId.toString() !== user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You do not own this collection.");
  }

  collection.isDeleted = true;
  await collection.save();

  return { message: "Collection deleted." };
};

export const CollectionService = {
  createCollection,
  updateCollection,
  getCollectionById,
  getUserCollections,
  addStoryToCollection,
  removeStoryFromCollection,
  deleteCollection,
};
