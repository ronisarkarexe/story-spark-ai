import mongoose from "mongoose";
import { Post } from "../src/app/modules/post/post.model";
import { Bookmark } from "../src/app/modules/bookmark/bookmark.model";
import config from "../src/config";

// Idempotent migration: backfill legacy Post.bookmarks into Bookmark docs + bookmarksCount.
const migrateBookmarks = async () => {
  await mongoose.connect(config.database_url as string);

  // Read the legacy array directly; the Post schema no longer defines it.
  const docs = await Post.collection
    .find({ bookmarks: { $exists: true, $type: "array" } })
    .project({ bookmarks: 1 })
    .toArray();

  let createdBookmarks = 0;
  let updatedPosts = 0;

  for (const doc of docs) {
    const userIds: mongoose.Types.ObjectId[] = Array.isArray(doc.bookmarks)
      ? doc.bookmarks
      : [];

    for (const userId of userIds) {
      const res = await Bookmark.updateOne(
        { userId, storyId: doc._id },
        { $setOnInsert: { userId, storyId: doc._id } },
        { upsert: true }
      );
      if (res.upsertedCount) createdBookmarks += 1;
    }

    const count = await Bookmark.countDocuments({ storyId: doc._id });
    await Post.collection.updateOne(
      { _id: doc._id },
      { $set: { bookmarksCount: count }, $unset: { bookmarks: "" } }
    );
    updatedPosts += 1;
  }

  console.log(
    `Migration complete. Posts updated: ${updatedPosts}, bookmarks created: ${createdBookmarks}.`
  );
  await mongoose.disconnect();
};

migrateBookmarks().catch(async (error) => {
  console.error("Bookmark migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
