import mongoose from "mongoose";

/**
 * MongoDB Connection URI from environment variables
 * Should be defined in .env.local as MONGODB_URI
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global type declaration for caching the mongoose connection
 * This prevents TypeScript errors when accessing global.mongoose
 */
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

/**
 * Global cache object for the mongoose connection
 * In development, Next.js hot reloading can cause multiple connections
 * This cache ensures we reuse the existing connection instead of creating new ones
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes and returns a MongoDB connection using Mongoose
 *
 * Features:
 * - Connection caching to prevent multiple connections in development
 * - Type-safe implementation without using 'any'
 * - Optimized connection options for production use
 *
 * @returns {Promise<mongoose.Connection>} The mongoose connection instance
 */
async function connectDB(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if promise doesn't exist
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering to fail fast if connection is lost
    };

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongooseInstance) => {
        console.log(" MongoDB connected successfully");
        return mongooseInstance.connection;
      })
      .catch((error) => {
        console.error(" MongoDB connection error:", error);
        // Clear the cached promise on error to allow retry
        cached.promise = null;
        throw error;
      });
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise;
  } catch (error) {
    // Clear both cache entries on connection failure
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
