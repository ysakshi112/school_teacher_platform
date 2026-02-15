const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


// routes imports
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const paymentRoutes = require("./routes/payments");
const userRoutes = require("./routes/users");


// app INIT FIRST ✅
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes usage (AFTER app init ✅)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);


// DB + server

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  });
