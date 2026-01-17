const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { verifyToken } = require("../middleware/auth");

/* -------------------- HELPERS -------------------- */
const isSuperAdmin = (req, res) => {
  if (req.user.role !== "superadmin") {
    res.status(403).json({ message: "Access denied" });
    return false;
  }
  return true;
};

/* =================================================
   GET ALL PENDING USERS
================================================= */
router.get("/pending-users", verifyToken, async (req, res) => {
  if (!isSuperAdmin(req, res)) return;

  try {
    const users = await User.find({ isApproved: false });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending users" });
  }
});

/* =================================================
   APPROVE USER (PRIMARY)
================================================= */
router.post("/approve-user/:id", verifyToken, async (req, res) => {
  if (!isSuperAdmin(req, res)) return;

  try {
    await User.findByIdAndUpdate(req.params.id, {
      isApproved: true,
      status: "APPROVED",
    });

    res.json({ message: "User approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

/* =================================================
   APPROVE USER (FRONTEND-FRIENDLY ALIAS)
   Used by: /api/admin/users/:id/approve
================================================= */
router.post("/users/:id/approve", verifyToken, async (req, res) => {
  if (!isSuperAdmin(req, res)) return;

  try {
    await User.findByIdAndUpdate(req.params.id, {
      isApproved: true,
      status: "APPROVED",
    });

    res.json({ message: "User approved" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

/* =================================================
   REJECT USER (PRIMARY)
================================================= */
router.patch("/reject/:id", verifyToken, async (req, res) => {
  if (!isSuperAdmin(req, res)) return;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "REJECTED",
        isApproved: false,
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
});

/* =================================================
   REJECT USER (FRONTEND-FRIENDLY ALIAS)
   Used by: /api/admin/users/:id/reject
================================================= */
router.post("/users/:id/reject", verifyToken, async (req, res) => {
  if (!isSuperAdmin(req, res)) return;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "REJECTED",
        isApproved: false,
      },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Rejection failed" });
  }
});

/* =================================================
   ADMIN STATS (FOR DASHBOARD)
================================================= */
router.get("/stats", verifyToken, async (req, res) => {
  if (!isSuperAdmin(req, res)) return;

  try {
    const totalUsers = await User.countDocuments();
    const pendingUsers = await User.countDocuments({
      isApproved: false,
    });
    const schools = await User.countDocuments({ role: "school" });
    const teachers = await User.countDocuments({ role: "teacher" });

    res.json({
      totalUsers,
      pendingUsers,
      schools,
      teachers,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

/* =================================================
   GET ALL USERS (FUTURE USE)
================================================= */
router.get("/users", verifyToken, async (req, res) => {
  if (!isSuperAdmin(req, res)) return;

  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
