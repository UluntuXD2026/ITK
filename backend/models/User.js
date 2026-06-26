const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  phoneNumber: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String },
  role: { type: String, enum: ["student", "teacher", "counselor", "parent"], default: "student" },
  school: { type: String, trim: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationCodeExpires: Date,
  heroes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],  // trusted contacts
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);