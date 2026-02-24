import mongoose from 'mongoose';

// const packSchema = new mongoose.Schema({
//   packID: { type: mongoose.Schema.Types.ObjectId, auto: true },
//   name: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   setID: { type: Number, required: true },
//   setName: { type: String, required: true },
// });

const packSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  cards: { type: [Number], default: [], required: true },
  rarities: {
    type: Map, of: Number,
    default: {
      "Common": 60,
      "Uncommon": 20,
      "Rare": 12,
      "Ultra Rare": 6,
      "Legendary": 2
    },
    required: true
  }
});

export default mongoose.model('Pack', setSchema);