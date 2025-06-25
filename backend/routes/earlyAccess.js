const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const EarlyAccessUser = require("../models/EarlyAccessUser");

// ✅ Register new user
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      role,
      clientAnswers = {},
      taskerAnswers = {},
    } = req.body;

    if (!name || !email || !role || !age) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await EarlyAccessUser.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const newUser = new EarlyAccessUser({
      name,
      email,
      age,
      role,
      status: "pending", // ✅ default status
      clientAnswers: role === "client" ? clientAnswers : {},
      taskerAnswers: role === "tasker" ? taskerAnswers : {},
    });

    await newUser.save();

    res.status(201).json({ message: "Successfully saved to waitlist!" });
  } catch (err) {
    console.error("❌ Error saving:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all users with optional filters: role and status
router.get("/all", async (req, res) => {
  try {
    const { role, status } = req.query;
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await EarlyAccessUser.find(query).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Update user status (accept/reject)
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedUser = await EarlyAccessUser.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get statistics: total users, clients, taskers
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await EarlyAccessUser.countDocuments();
    const totalClients = await EarlyAccessUser.countDocuments({ role: "client" });
    const totalTaskers = await EarlyAccessUser.countDocuments({ role: "tasker" });

    const pending = await EarlyAccessUser.countDocuments({ status: "pending" });
    const accepted = await EarlyAccessUser.countDocuments({ status: "accepted" });
    const rejected = await EarlyAccessUser.countDocuments({ status: "rejected" });

    res.status(200).json({
      totalUsers,
      totalClients,
      totalTaskers,
      statusCounts: {
        pending,
        accepted,
        rejected,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
