require("dotenv").config()
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const jwtKey = process.env.JWTKEY;

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, school, role } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      school,
      role
    });

    await newUser.save();

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Verification code for", email, ":", code);

    res.status(201).json({ message: `Verification sent to ${email}`, code });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // For now, accept any 6-digit code (simplified)
    user.isVerified = true;
    await user.save();

    const token = jwt.sign({ userid: user._id, email: user.email }, jwtKey);

    res.status(200).json({ message: "Email verified successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ userid: user._id, email: user.email }, jwtKey);

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
});

router.get("/me", require("../middleware/auth"), async (req, res) => {
  try {
    const user = await User.findById(req.user.userid).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;