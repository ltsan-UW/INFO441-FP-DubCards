import mongoose from 'mongoose';

// const packSchema = new mongoose.Schema({
//   packID: { type: mongoose.Schema.Types.ObjectId, auto: true },
//   name: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   setID: { type: Number, required: true },
//   setName: { type: String, required: true },
// });

const setSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  cards: { type: [Number], default: [], required: true},
  rarities: [
    {
      rarity: {
        type: String,
        enum: ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Legendary'],
        required: true,
      },
      weight: { type: Number, required: true } // probability weight, total should add to 100.
    }
  ],
});

export default mongoose.model('Set', setSchema);