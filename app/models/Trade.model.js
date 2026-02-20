import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  tradeID: { type: Number, required: true, unique: true },
  senderUserID: { type: Number, required: true },
  receiverUserID: { type: Number, required: true },
  senderCards: [{ cardID: { type: Number, required: true } }],
  receiverCards: [{ cardID: { type: Number, required: true } }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

tradeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Trade', tradeSchema);