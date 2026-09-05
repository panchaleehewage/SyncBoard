import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  leader: { type: String, required: true, index: true },
  members: [{ type: String, index: true }],
  columns: [{
    label: { type: String, required: true },
    color: { type: String, required: true }
  }],
  tags: [{
    label: { type: String, required: true },
    color: { type: String, required: true }
  }]
}, { timestamps: true });

boardSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Board = mongoose.model('Board', boardSchema);