import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  googleId: { type: String, default: null },
  bio: { type: String, default: '' },
  avatar: { type: mongoose.Schema.Types.Mixed, default: null },
  pendingInvites: {
    type: [{
      boardId: { type: String, required: true },
      boardTitle: { type: String, required: true },
      invitedBy: { type: String, required: true },
      _id: false,
    }],
    default: [],
  }
}, { timestamps: true });


userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

export const User = mongoose.model('User', userSchema);