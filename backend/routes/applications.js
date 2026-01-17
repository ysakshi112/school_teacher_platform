const express = require("express");
const router = express.Router();
const Application = require("../models/application");
const Job = require("../models/job");
const User = require("../models/user");
const { verifyToken, verifyRole } = require("../middleware/auth");

/* ======================================================
   TEACHER → APPLY TO JOB
====================================================== */
router.post(
  "/apply",
  verifyToken,
  verifyRole("teacher"),
  async (req, res) => {
    const { jobId } = req.body;

    try {
      const teacher = await User.findById(req.user.userId);
      if (!teacher)
        return res.status(404).json({ message: "User not found" });

      if (teacher.credits <= 0) {
        return res.status(400).json({
          message: "No credits left. Please buy more credits.",
        });
      }

      const existing = await Application.findOne({
        jobId,
        teacherId: teacher._id,
      });

      if (existing) {
        return res.status(400).json({ message: "Already applied" });
      }

      // ✅ DO NOT SET STATUS — let schema default handle it
      const application = await Application.create({
        jobId,
        teacherId: teacher._id,
      });

      teacher.credits -= 1;
      await teacher.save();

      res.json(application);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Apply failed" });
    }
  }
);

/* ======================================================
   TEACHER → VIEW OWN APPLICATIONS
====================================================== */
router.get(
  "/teacher/applications",
  verifyToken,
  verifyRole("teacher"),
  async (req, res) => {
    try {
      const applications = await Application.find({
        teacherId: req.user.userId,
      })
        .populate("jobId", "title subject description")
        .populate("teacherId", "name email");

      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  }
);

/* ======================================================
   SCHOOL → VIEW ALL APPLICATIONS FOR OWN JOBS
====================================================== */
router.get(
  "/school/me",
  verifyToken,
  verifyRole("school"),
  async (req, res) => {
    try {
      const jobs = await Job.find({ schoolId: req.user.userId }).select("_id");
      const jobIds = jobs.map((job) => job._id);

      const applications = await Application.find({
        jobId: { $in: jobIds },
      })
        .populate("jobId", "title subject")
        .populate("teacherId", "name email");

      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  }
);

/* ======================================================
   SCHOOL → VIEW APPLICATIONS FOR A SINGLE JOB
====================================================== */
router.get(
  "/school/job/:jobId",
  verifyToken,
  verifyRole("school"),
  async (req, res) => {
    try {
      const job = await Job.findOne({
        _id: req.params.jobId,
        schoolId: req.user.userId,
      });

      if (!job)
        return res.status(403).json({ message: "Access denied" });

      const applications = await Application.find({
        jobId: job._id,
      })
        .populate("teacherId", "name email")
        .populate("jobId", "title");

      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  }
);

/* ======================================================
   SCHOOL → SHORTLIST APPLICATION
====================================================== */
router.patch(
  "/:applicationId/shortlist",
  verifyToken,
  verifyRole("school"),
  async (req, res) => {
    try {
      const application = await Application.findById(req.params.applicationId)
        .populate("jobId");

      if (
        !application ||
        application.jobId.schoolId.toString() !== req.user.userId
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      application.status = "SHORTLISTED";
      await application.save();

      res.json(application);
    } catch (err) {
      res.status(500).json({ message: "Shortlist failed" });
    }
  }
);

/* ======================================================
   SCHOOL → REJECT APPLICATION
====================================================== */
router.patch(
  "/:applicationId/reject",
  verifyToken,
  verifyRole("school"),
  async (req, res) => {
    try {
      const application = await Application.findById(req.params.applicationId)
        .populate("jobId");

      if (
        !application ||
        application.jobId.schoolId.toString() !== req.user.userId
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      application.status = "REJECTED";
      await application.save();

      res.json(application);
    } catch (err) {
      res.status(500).json({ message: "Rejection failed" });
    }
  }
);

module.exports = router;
