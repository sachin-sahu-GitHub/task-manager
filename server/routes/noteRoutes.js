import express from 'express';
import mongoose from 'mongoose';
import Note from '../models/Note.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Every route below this line first verifies the JWT.
router.use(authMiddleware);

function validNoteInput(title, content) {
  return typeof title === 'string' && title.trim() && typeof content === 'string' && content.trim();
}

router.get('/', async (req, res) => {
  try {
    // req.userId was added by authMiddleware, so another user's notes cannot match.
    const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!validNoteInput(title, content)) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const note = await Note.create({ title: title.trim(), content: content.trim(), user: req.userId });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!validNoteInput(title, content)) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Note not found' });

    // user is part of the query: knowing another note's id is not enough to edit it.
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title: title.trim(), content: content.trim() },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Note not found' });
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
