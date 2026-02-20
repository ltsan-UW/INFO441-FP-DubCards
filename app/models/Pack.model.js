import mongoose from 'mongoose';

const packSchema = new mongoose.Schema({
  packID: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  setID: { type: Number, required: true },
  setName: { type: String, required: true },
});

export default mongoose.model('Pack', packSchema);