const winston = require('winston');
const { MongoMemoryServer } = require('mongodb-memory-server');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [new winston.transports.Console()],
});

(async () => {
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'story_spark_ai',
      },
    });
    logger.info(`MongoDB Memory Server started at ${mongod.getUri()}`);
    
    // keep alive
    setInterval(() => {}, 1000 * 60 * 60);
  } catch (err) {
    logger.error(`Error starting mongodb memory server: ${err instanceof Error ? err.stack || err.message : String(err)}`);
    process.exit(1);
  }
})();
