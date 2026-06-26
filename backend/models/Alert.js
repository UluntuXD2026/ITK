const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: String, enum: ["angry", "overwhelmed", "sad"] },
  location: { type: String },
  status: { type: String, enum: ["active", "cancelled", "resolved"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);