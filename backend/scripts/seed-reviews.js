const mongoose = require("mongoose");
const { randomInt } = require("crypto");

const MONGO = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/story_spark_ai";
const TOTAL = Number(process.argv[2] || process.env.SEED_COUNT) || 10000;
const BATCH = Number(process.env.SEED_BATCH) || 1000;

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
  console.log(`Connecting to ${MONGO}`);
  await mongoose.connect(MONGO, { maxPoolSize: 20 });
  const db = mongoose.connection.db;
  const coll = db.collection("reviews");

  console.log(`Seeding ${TOTAL} reviews in batches of ${BATCH}...`);
  let inserted = 0;
  while (inserted < TOTAL) {
    const batchSize = Math.min(BATCH, TOTAL - inserted);
    const docs = [];
    for (let i = 0; i < batchSize; i++) {
      docs.push(reviewDoc(inserted + i + 1));
    }
    const res = await coll.insertMany(docs);
    inserted += res.insertedCount;
    console.log(`Inserted ${inserted}/${TOTAL}`);
  }

  console.log("Seeding complete. Closing connection.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
