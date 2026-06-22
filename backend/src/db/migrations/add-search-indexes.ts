/**
 * Migration: add-search-indexes
 *
 * Adds a compound text index on Post (title, content, tag) for full-text search
 * and a regular index on User.name for fast author lookup.
 *
 * Run once:
 *   npx ts-node backend/src/db/migrations/add-search-indexes.ts
 */

import mongoose from "mongoose";
import config from "../../config";

async function up() {
  await mongoose.connect(config.database_url as string);
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("Database connection failed");
  }

  // ── Post text index ──────────────────────────────────────────────────────
  const postCollection = db.collection("posts");

  const existingIndexes = await postCollection.indexes();
  const hasTextIndex = existingIndexes.some(
    (idx) => idx.name === "title_text_content_text_tag_text"
  );

  if (!hasTextIndex) {
    await postCollection.createIndex(
      { title: "text", content: "text", tag: "text" },
      {
        name: "title_text_content_text_tag_text",
        weights: { title: 10, tag: 5, content: 1 },
        default_language: "english",
      }
    );
    console.log("✅ Post text index created");
  } else {
    console.log("ℹ️  Post text index already exists — skipping");
  }

  // ── Post createdAt index (date-sorted queries) ───────────────────────────
  await postCollection.createIndex(
    { createdAt: -1 },
    { name: "post_createdAt_desc", background: true }
  );
  console.log("✅ Post createdAt index ensured");

  // ── User.name index (author lookup) ──────────────────────────────────────
  const userCollection = db.collection("users");
  await userCollection.createIndex(
    { name: 1 },
    { name: "user_name_asc", background: true }
  );
  console.log("✅ User.name index ensured");

  await mongoose.disconnect();
  console.log("Migration complete.");
}

up().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});