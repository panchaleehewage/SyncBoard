import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  leader: { type: String, required: true, index: true }, // Index for quick queries
  members: [{ type: String, index: true }], // Index to quickly find user's boards
  columns: [{
    label: { type: String, required: true },
    color: { type: String, required: true }
  }],
  tags: [{
    label: { type: String, required: true },
    color: { type: String, required: true }
  }]
}, { timestamps: true });

// Ensure __v version key is managed properly (Mongoose does this by default)
export const Board = mongoose.model('Board', boardSchema);