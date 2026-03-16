import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  currency: { type: Number, default: 500 },
  createdAt: { type: Date, default: Date.now },
  inventory: [
    {
      name: { type: String, required: true },
      cardID: { type: Number, required: true },
      rarity: {
        type: String,
        enum: ['Common', 'Uncommon', 'Rare', 'Ultra-Rare', 'Legendary'],
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
  favorites: { type: [Number], default: []},
  friends: { type: [String], default: [] },
  friendRequests: { type: [String], default: [] },
});

export default mongoose.model('User', userSchema);