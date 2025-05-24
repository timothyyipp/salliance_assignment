const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messageSchema = new schema({
  senderId: { type: schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

messageSchema.index({ senderId: 1, receiverId: 1, timestamp: 1 });

module.exports = mongoose.model('Message', messageSchema);