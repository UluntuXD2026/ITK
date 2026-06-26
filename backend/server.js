require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");

const app = express();
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.error("mongoDB connection failed", err));

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.status(200).send("ITK API is running");
});

app.use("/auth", authRoutes)
app.use("/reports", reportRoutes)

app.listen(PORT, () => {
  console.log(`ITK app listening on port ${PORT}`);
});