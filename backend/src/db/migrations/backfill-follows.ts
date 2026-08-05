
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

  await mongoose.disconnect();
}

up().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

