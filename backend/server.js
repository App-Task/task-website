const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const earlyAccessRoutes = require("./routes/earlyAccess");
const adminRoutes = require("./routes/admin"); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "https://task-websitee.netlify.app",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // ✅ Add PATCH here
  allowedHeaders: ["Content-Type", "Authorization"],
};


app.use(cors(corsOptions));
app.use(express.json());

// ✅ Routes
app.use("/api/early-access", earlyAccessRoutes);
app.use("/api/admin", adminRoutes); 

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
