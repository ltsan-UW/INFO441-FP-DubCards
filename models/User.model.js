import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userID: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currency: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  inventory: [
    {
      cardID: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  favorites: [
    {
      cardID: { type: Number, required: true },
    },
  ],
});

export default mongoose.model('User', userSchema);