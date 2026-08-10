
/**
 * Migration: backfill-follows
 *
 * Converts embedded User.following arrays into Follow documents.
 *
 * Run once:
 * npx ts-node backend/src/db/migrations/backfill-follows.ts
 */

import mongoose from "mongoose";
import config from "../../config";
import { User } from "../../app/modules/user/user.model";
import { Follow } from "../../app/modules/follow/follow.model";

async function up() {
  await mongoose.connect(config.database_url as string);

  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection failed");

  // ── Idempotency lock using MongoDB ────────────────────────────────────
  const lockCollection = db.collection("migration_locks");

  // Create unique index on key to prevent duplicate locks
  await lockCollection.createIndex({ key: 1 }, { unique: true });

  let lockAcquired = false;
  try {
    await lockCollection.insertOne({
      key: "backfill-follows",
      lockedAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min TTL
    });
    lockAcquired = true;
  } catch {
    console.log("ℹ️  Migration already running or completed — skipping");
    await mongoose.disconnect();
    return;
  }

  try {
    const users = await User.find({});

  let processed = 0;

  for (const user of users) {
    for (const followingId of user.following || []) {
      try {
        await Follow.updateOne(
          {
            follower: user._id,
            following: followingId,
          },
          {
            $setOnInsert: {
              follower: user._id,
              following: followingId,
            },
          },
          {
            upsert: true,
          }
        );

        processed++;
      } catch (error) {
        console.error(
          `Failed to migrate follow relationship ${user._id} -> ${followingId}`,
          error
        );
      }
    }
  }

  console.log(`Backfill complete. Processed ${processed} follow relationships.`);

  // Release lock after successful migration
    await lockCollection.deleteOne({ key: "backfill-follows" });
    console.log("Lock released.");
  } catch (error) {
    console.error("Migration error:", error);
    if (lockAcquired) {
      await lockCollection.deleteOne({ key: "backfill-follows" });
    }
    throw error;
  }

  await mongoose.disconnect();
}

up().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

