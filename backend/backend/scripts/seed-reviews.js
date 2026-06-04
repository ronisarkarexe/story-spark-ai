const mongoose = require("mongoose");
const { randomInt } = require("crypto");

//validating mongodb url before connecting
const MONGO =
  process.env.DATABASE_URL ||
  "mongodb://127.0.0.1:27017/story_spark_ai";

try {
  const parsed = new URL(MONGO);

  if (!["mongodb:", "mongodb+srv:"].includes(parsed.protocol)) {
    throw new Error("Unsupported MongoDB protocol");
  }
} catch (error) {
  console.error(`❌ Invalid DATABASE_URL: ${error.message}`);
  process.exit(1);
}

const TOTAL = Number(process.argv[2] || process.env.SEED_COUNT ?? 10000);
const BATCH = Number(process.env.SEED_BATCH ?? 1000);

if (!Number.isInteger(TOTAL) || TOTAL <= 0) {
  console.error("❌ TOTAL must be a positive integer");
  process.exit(1);
}

if (!Number.isInteger(BATCH) || BATCH <= 0) {
  console.error("❌ BATCH must be a positive integer");
  process.exit(1);
}

const reviewDoc = (i) => ({
  userId: new mongoose.Types.ObjectId(),
  name: `Seeder User ${i}`,
  role: "user",
  feedback: `This is synthetic feedback number ${i}. Lorem ipsum dolor sit amet.`,
  imgSrc: "",
  rating: randomInt(5) + 1,
  isPublished: true,
  sortOrder: randomInt(1000),
  createdAt: new Date(),
  updatedAt: new Date(),
});

async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO, { maxPoolSize: 20 });
  const db = mongoose.connection.db;
  const coll = db.collection("reviews");

  console.log(`Seeding ${TOTAL} reviews in batches of ${BATCH}...`);
  let inserted = 0;
  while (inserted < TOTAL) {
    const batchSize = Math.min(BATCH, TOTAL - inserted);
    try {
  const docs = Array.from({ length: batchSize }, (_, i) =>
    reviewDoc(inserted + i + 1)
  );

  const res = await coll.insertMany(docs, {
    ordered: false,
  });

  inserted += res.insertedCount;

  console.log(`✅ Inserted ${inserted}/${TOTAL}`);}
  catch (error) {
  console.error(
    `❌ Batch insertion failed after ${inserted} inserts:`,
    error.message
  );

  throw error;
}
  }

  console.log("Seeding complete. Closing connection.");
  await mongoose.disconnect();
}

main()
  .catch((err) => {
    console.error("❌ Seeder failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
      console.log("MongoDB connection closed.");
    } catch (disconnectError) {
      console.error(
        "Failed to close MongoDB connection:",
        disconnectError.message
      );
    }
  });
