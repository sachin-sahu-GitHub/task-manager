import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Lets Express read JSON sent by the React app.

app.get('/api/health', (req, res) => {
  res.json({ message: 'Notes API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Keep the database URL out of code. Put it in server/.env instead.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

