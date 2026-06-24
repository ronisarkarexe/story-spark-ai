import mongoose from "mongoose";
import { Post } from "../src/app/modules/post/post.model";
import { Bookmark } from "../src/app/modules/bookmark/bookmark.model";
import config from "../src/config";

// Idempotent migration: backfill legacy Post.bookmarks into Bookmark docs + bookmarksCount.

const toValidObjectIdString = (value: unknown): string | null => {
  if (value instanceof mongoose.Types.ObjectId) {
    return value.toString();
  }

  if (typeof value === "string" && mongoose.Types.ObjectId.isValid(value)) {
    return value;
  }

  return null;
};

const migrateBookmarks = async () => {
  let createdBookmarks = 0;
  let updatedPosts = 0;

  try {
    await mongoose.connect(config.database_url as string);

    // Read the legacy array directly; the Post schema no longer defines it.
    const docs = await Post.collection
      .find({ bookmarks: { $exists: true, $type: "array" } })
      .project({ bookmarks: 1 })
      .toArray();

    for (const doc of docs) {
      const rawBookmarks = Array.isArray(doc.bookmarks) ? doc.bookmarks : [];

      // Remove invalid IDs and duplicate user IDs from the legacy bookmarks array.
      const userIds = [
        ...new Set(
          rawBookmarks
            .map((id) => toValidObjectIdString(id))
            .filter((id): id is string => Boolean(id))
        ),
      ].map((id) => new mongoose.Types.ObjectId(id));

      if (userIds.length > 0) {
        const result = await Bookmark.bulkWrite(
          userIds.map((userId) => ({
            updateOne: {
              filter: {
                userId,
                storyId: doc._id,
              },
              update: {
                $setOnInsert: {
                  userId,
                  storyId: doc._id,
                },
              },
              upsert: true,
            },
          })),
          { ordered: false }
        );

        createdBookmarks += result.upsertedCount || 0;
      }

      const count = await Bookmark.countDocuments({ storyId: doc._id });

      await Post.collection.updateOne(
        { _id: doc._id },
        {
          $set: { bookmarksCount: count },
          $unset: { bookmarks: "" },
        }
      );

      updatedPosts += 1;
    }

    console.log(
      `Migration complete. Posts updated: ${updatedPosts}, bookmarks created: ${createdBookmarks}.`
    );
  } finally {
    await mongoose.disconnect();
  }
};

migrateBookmarks().catch((error) => {
  console.error("Bookmark migration failed:", error);
  process.exit(1);
});
