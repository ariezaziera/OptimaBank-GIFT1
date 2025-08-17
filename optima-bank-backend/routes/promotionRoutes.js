// routes/promotion.js
const express = require("express");
const router = express.Router();
const Promotion = require("../models/Promotion");

// @route   GET /api/promotions
// @desc    Get all active promotions
// @access  Public (or add auth middleware if needed)
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ startDate: -1 });

    res.json(promotions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/promotions
// @desc    Add a new promotion
// @access  Admin (protect later with auth middleware)
router.post("/", async (req, res) => {
  try {
    const { title, description, imageUrl, startDate, endDate, category } = req.body;

    const newPromotion = new Promotion({
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      category
    });

    const promotion = await newPromotion.save();
    res.json(promotion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/promotions/:id
// @desc    Delete promotion by ID
// @access  Admin
router.delete("/:id", async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ msg: "Promotion removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;