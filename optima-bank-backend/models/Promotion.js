// models/Promotion.js
const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String }, // optional if you want banner images
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  category: { type: String }, // optional (ex: "Credit Card", "Loans")
}, { timestamps: true });

module.exports = mongoose.model("Promotion", promotionSchema);
