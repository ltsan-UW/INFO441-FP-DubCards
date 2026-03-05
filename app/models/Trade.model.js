import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  senderUsername: { type: String, required: true },
  receiverUsername: { type: String, required: true },
  senderCards: { type: [Number], required: true },
  receiverCards: { type: [Number], required: true },
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