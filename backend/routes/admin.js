const express = require("express");
const bcrypt = require("bcrypt"); // ✅ required for secure comparison
const router = express.Router();

// ✅ Hashed version of the password "0000"
const storedHash = "$2b$10$3m9FQz7Br8SxJbpWrBiMYODzN0IGuYu33E1YOr4LXgbsUICZHR9pi";

router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  const isMatch = bcrypt.compareSync(password, storedHash);

  if (isMatch) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ error: "Incorrect password" });
  }
});

module.exports = router;

