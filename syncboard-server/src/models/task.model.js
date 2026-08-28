import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true, index: true },
  title: { type: String, required: true },
  assignee: { type: String, default: null },
  dueDate: { type: Date, default: null },
  tags: [{type: String}],
  status: { type: String, required: true },
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);