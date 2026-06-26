const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bullyName: { type: String, trim: true },
  type: { type: String, enum: ["physical", "verbal", "cyber", "social", "other"], required: true },
  description: { type: String, required: true },
  location: { type: String, trim: true },
  dateOccurred: { type: Date },
  isAnonymous: { type: Boolean, default: false },
  status: { type: String, enum: ["submitted", "reviewed", "resolved"], default: "submitted" },
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);