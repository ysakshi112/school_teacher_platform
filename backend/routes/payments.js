const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/user");
const razorpay = require("../config/razorpay");
const { verifyToken } = require("../middleware/auth");

const PRICE_PER_CREDIT = 10; // ₹10 per credit
const ALLOWED_PACKS = [5, 10, 20];

/* ---------------- CREATE ORDER ---------------- */
router.post("/create-order", verifyToken, async (req, res) => {
  const { credits } = req.body;

  if (req.user.role !== "teacher") {
    return res.status(403).json({
      message: "Only teachers can buy credits",
    });
  }

  if (!ALLOWED_PACKS.includes(credits)) {
    return res.status(400).json({
      message: "Invalid credit pack",
    });
  }

  try {
    const amount = credits * PRICE_PER_CREDIT * 100;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

/* ---------------- VERIFY PAYMENT ---------------- */
router.post("/verify", verifyToken, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    credits,
  } = req.body;

  if (req.user.role !== "teacher") {
    return res.status(403).json({
      message: "Only teachers can buy credits",
    });
  }

  if (!ALLOWED_PACKS.includes(credits)) {
    return res.status(400).json({
      message: "Invalid credit pack",
    });
  }

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const user = await User.findById(req.user.userId);

    user.credits += credits;
    await user.save();

    res.json({
      success: true,
      credits: user.credits,
    });
  } catch (err) {
    res.status(500).json({ message: "Credits update failed" });
  }
});

module.exports = router;
