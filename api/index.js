import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../server/app.js';

dotenv.config();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
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