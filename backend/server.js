const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const earlyAccessRoutes = require("./routes/earlyAccess");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Preflight-safe CORS for frontend
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions)); // ✅ DON'T add app.options("*") on Node 22+
app.use(express.json());

// ✅ Routes
app.use("/api/early-access", earlyAccessRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
