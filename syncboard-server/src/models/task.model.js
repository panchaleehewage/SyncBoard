import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true, index: true },
  title: { type: String, required: true },
  assignee: { type: String, default: null },
  dueDate: { type: Date, default: null },
  tags: [{ type: String }],
  status: { type: String, required: true },
}, { timestamps: true });

// Map _id → id and boardId ObjectId → string for clean API responses
taskSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    if (ret.boardId) ret.boardId = ret.boardId.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Task = mongoose.model('Task', taskSchema);