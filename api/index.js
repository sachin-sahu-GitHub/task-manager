import mongoose from 'mongoose';
import app from '../server/app.js';

// A warm Vercel function can serve more than one request. Keep one connection
// promise so concurrent requests do not open separate MongoDB connections.
let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not configured');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .catch((error) => {
        // Allow a later request to retry if the first connection attempt failed.
        connectionPromise = undefined;
        throw error;
      });
  }

  await connectionPromise;
}

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    return res.status(500).json({
      message: 'Database connection failed'
    });
  }
}
