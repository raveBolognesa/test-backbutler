const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const groupSchema = new Schema({
  name: String,
  leader: {type: Schema.Types.ObjectId, ref:'User'},
  service: {type: Schema.Types.ObjectId, ref:'Service'},
  members: Number,
  freePlace: Number,
  pricePerson: Number,
  paymentDay: Number,
  description: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;