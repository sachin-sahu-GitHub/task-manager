import mongoose from 'mongoose';

// Both the local server and the Vercel function import server modules. Keeping
// the connection here ensures those modules all use this same Mongoose instance.
let connectionPromise;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not configured');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  await connectionPromise;
}

