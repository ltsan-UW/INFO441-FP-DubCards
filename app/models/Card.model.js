import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  cardID: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Legendary'],
    required: true,
  },
  packID: { type: mongoose.ObjectId, required: true },
  packName: { type: String, required: true },
});

export default mongoose.model('Card', cardSchema);