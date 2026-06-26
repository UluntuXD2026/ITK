const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const Report = require("../models/Report");

// Submit a new bullying report
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { bullyName, type, description, location, dateOccurred, isAnonymous } = req.body;

    const report = await Report.create({
      reporter: req.user.userid,
      bullyName,
      type,
      description,
      location,
      dateOccurred: dateOccurred ? new Date(dateOccurred) : undefined,
      isAnonymous,
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
});

// Get all reports for the logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user.userid })
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single report
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;