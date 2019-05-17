const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const chatSchema = new Schema({
  message: Array,
  owner: String,
  speaker: String,
  product: String,
  imgChat: String,
  // owner: { type: Schema.Types.ObjectId, ref: 'Users' },
  // speaker: { type: Schema.Types.ObjectId, ref: 'Users' },
  // product: { type: Schema.Types.ObjectId, ref: 'Products' },
  title: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
