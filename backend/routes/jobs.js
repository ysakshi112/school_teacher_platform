const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const User = require("../models/user");
const { verifyToken, verifyRole } = require("../middleware/auth");

/* ======================================================
   SCHOOL → CREATE JOB
====================================================== */
router.post(
  "/create",
  verifyToken,
  verifyRole("school"),
  async (req, res) => {
    const { title, description, subject } = req.body;

    try {
      const school = await User.findById(req.user.userId);

      if (!school)
        return res.status(404).json({ message: "School not found" });

      // ❗ block unapproved schools
      if (school.status !== "APPROVED") {
        return res.status(403).json({
          message: "Your account is pending admin approval",
        });
      }

      const job = await Job.create({
        title,
        description,
        subject,
        schoolId: school._id,
      });

      res.json(job);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Job creation failed" });
    }
  }
);

/* ======================================================
   TEACHER → VIEW ALL JOBS (ONLY APPROVED SCHOOLS)
====================================================== */
router.get("/all", verifyToken, async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate({
        path: "schoolId",
        match: { status: "APPROVED" },
        select: "name",
      })
      .sort({ createdAt: -1 });

    // remove jobs where school is not approved
    const filteredJobs = jobs.filter((job) => job.schoolId);

    res.json(filteredJobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

/* ======================================================
   SCHOOL → VIEW OWN JOBS
====================================================== */
router.get(
  "/school/me",
  verifyToken,
  verifyRole("school"),
  async (req, res) => {
    try {
      const jobs = await Job.find({
        schoolId: req.user.userId,
      }).sort({ createdAt: -1 });

      res.json(jobs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  }
);

/* ======================================================
   SCHOOL → UPDATE JOB
====================================================== */
router.put(
  "/:jobId/update",
  verifyToken,
  verifyRole("school"),
  async (req, res) => {
    try {
      const job = await Job.findOneAndUpdate(
        {
          _id: req.params.jobId,
          schoolId: req.user.userId,
        },
        req.body,
        { new: true }
      );

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (err) {
      res.status(500).json({ message: "Job update failed" });
    }
  }
);

/* ======================================================
   SCHOOL → DELETE JOB
====================================================== */
router.delete(
  "/:jobId/delete",
  verifyToken,
  verifyRole("school"),
  async (req, res) => {
    try {
      const job = await Job.findOneAndDelete({
        _id: req.params.jobId,
        schoolId: req.user.userId,
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json({ message: "Job deleted" });
    } catch (err) {
      res.status(500).json({ message: "Job deletion failed" });
    }
  }
);

module.exports = router;
