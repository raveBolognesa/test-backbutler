const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const paymentSchema = new Schema({
  
  price: String,
  description: String,
  title: String,
  author: Object,
  localization: String,
  date: String,
  imgProduct: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;