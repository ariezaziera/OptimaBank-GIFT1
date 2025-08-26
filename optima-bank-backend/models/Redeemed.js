const mongoose = require("mongoose");

const redeemedVoucherSchema = new mongoose.Schema({
  voucherId: { type: String, required: true, unique: true }, // voucher ID from dataset
  name: { type: String, required: true },
  category: { type: String, required: true },
  redeemedSerials: { type: [String], default: [] }           // array of all redeemed serials
}, { timestamps: true });                                     // optional: track createdAt/updatedAt

module.exports = mongoose.model("Redeemed", redeemedVoucherSchema, 'redeemed');
