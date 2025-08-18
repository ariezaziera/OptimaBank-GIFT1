// models/Voucher.js
const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  terms: String,
  available: Number
});

module.exports = mongoose.model('Voucher', voucherSchema, 'voucher'); // collection name = 'voucher'
