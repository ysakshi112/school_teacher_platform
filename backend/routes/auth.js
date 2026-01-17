const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  const { token, role } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // ✅ FIX IS HERE
    const payload = ticket.getPayload();
    const { name, email } = payload;

    if (!email || !name) {
      return res.status(400).json({
        message: "Invalid Google account data",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role,
        status: role === "superadmin" ? "APPROVED" : "PENDING",
        credits: role === "teacher" ? 0 : 0,
      });
    }

    // ❌ block unapproved users
    if (user.role !== "superadmin" && user.status !== "APPROVED") {
      return res.status(403).json({
        message: "Your account is pending admin approval",
      });
    }

    const tokenJWT = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        status: user.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: tokenJWT,
      user,
    });
  } catch (err) {
    console.error("Google auth failed:", err);
    res.status(401).json({ message: "Invalid Google Token" });
  }
});

module.exports = router;
