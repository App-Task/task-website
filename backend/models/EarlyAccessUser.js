const mongoose = require("mongoose");

const EarlyAccessUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["client", "tasker"], required: true },
  age: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  
  
  clientAnswers: {
    taskType: String,
    usageFrequency: String,
    contactMethod: String,
  },
  taskerAnswers: {
    servicesOffered: String,
    experienceLevel: String,
    weeklyAvailability: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EarlyAccessUser", EarlyAccessUserSchema, "early_access_users");
