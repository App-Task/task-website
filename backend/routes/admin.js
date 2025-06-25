const express = require("express");
const router = express.Router();
require("dotenv").config();

// ✅ POST /api/admin/login
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  if (password === process.env.ADMIN_PANEL_PASSWORD) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: "Incorrect password" });
  }
});

module.exports = router;
