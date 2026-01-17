const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { verifyToken } = require("../middleware/auth");

/* ======================================================
   GET CURRENT LOGGED-IN USER
====================================================== */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // block rejected users
    if (user.status === "REJECTED") {
      return res.status(403).json({
        message: "Your account has been rejected",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   UPDATE PROFILE (NAME ONLY)
   Future-safe, UI-ready
====================================================== */
router.patch("/me", verifyToken, async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

/* ======================================================
   LOGOUT (JWT CLIENT-SIDE CLEAR)
====================================================== */
router.post("/logout", verifyToken, (req, res) => {
  // JWT is stateless, frontend clears token
  res.json({ message: "Logged out successfully" });
});

/* ======================================================
   ADMIN → GET USER BY ID (FUTURE)
====================================================== */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    // only superadmin should use this (extra safety)
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

module.exports = router;
