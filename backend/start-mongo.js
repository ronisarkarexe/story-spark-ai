const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'story_spark_ai'
      }
    });
    console.log(`MongoDB Memory Server started at ${mongod.getUri()}`);
    // keep alive
    setInterval(() => {}, 1000 * 60 * 60);
  } catch (err) {
    console.error('Error starting mongodb memory server:', err);
    process.exit(1);
  }
})();
