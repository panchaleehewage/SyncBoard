import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar: { type: mongoose.Schema.Types.Mixed, default: null },
  pendingInvites: { type: Array, default: [] }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

// Strip password and map _id to id
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Removes the need to manually strip in services
    return ret;
  }
});

export const User = mongoose.model('User', userSchema);