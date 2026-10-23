import "server-only";

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI ?? process.env.MONGODB_URI;

interface MongooseCache {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  failedAt: number | null;
}

const globalForMongoose = globalThis as unknown as {
  __snMongoose?: MongooseCache;
};

const cached: MongooseCache =
  globalForMongoose.__snMongoose ??
  (globalForMongoose.__snMongoose = {
    connection: null,
    promise: null,
    failedAt: null,
  });

const RETRY_AFTER_MS = 15_000;

export function isDatabaseConfigured() {
  return Boolean(MONGODB_URI);
}

/**
 * Cached MongoDB connection.
 *
 * The promise is reused across hot reloads and serverless invocations to avoid
 * opening a new connection for every request. A failed attempt is remembered
 * briefly so a broken URI does not add a timeout to every page render.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MongoDB is not configured. Set MONGO_URI in your environment variables.",
    );
  }

  if (cached.connection && mongoose.connection.readyState === 1) {
    return cached.connection;
  }

  if (cached.failedAt && Date.now() - cached.failedAt < RETRY_AFTER_MS) {
    throw new Error("MongoDB is temporarily unavailable.");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB,
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 6_000,
        socketTimeoutMS: 45_000,
        bufferCommands: false,
        autoIndex: process.env.NODE_ENV !== "production",
      })
      .then((instance) => {
        cached.connection = instance;
        cached.failedAt = null;
        return instance;
      })
      .catch((error: unknown) => {
        cached.promise = null;
        cached.connection = null;
        cached.failedAt = Date.now();
        const message =
          error instanceof Error ? error.message : "Unknown MongoDB error";
        console.error(`[db] connection failed: ${message}`);
        throw new Error("Unable to connect to MongoDB.");
      });
  }

  return cached.promise;
}
