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
  cardType: { type: String, required: true },
  setID: { type: Number, required: true },
  setName: { type: String, required: true },
});

export default mongoose.model('Card', cardSchema);