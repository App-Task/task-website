const express = require("express");
const router = express.Router();
const EarlyAccessUser = require("../models/EarlyAccessUser");

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

module.exports = router;
