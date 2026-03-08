import mongoose from 'mongoose';

const packSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  cards: { type: [Number], default: [] },
  rarities: {
    type: Map, of: Number,
    default: {
      "Common": 60,
      "Uncommon": 20,
      "Rare": 12,
      "Ultra-Rare": 6,
      "Legendary": 2
    },
    required: true
  }
});

export default mongoose.model('Pack', packSchema);