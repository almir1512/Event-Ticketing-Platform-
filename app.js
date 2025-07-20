const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");
const bookingRoutes = require("./routes/booking");
const superAdminRoutes = require("./routes/superadmin");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/superadmin-only", superAdminRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).json({ message: message });
});

mongoose
  .connect(
    "mongodb+srv://almir:UXfYotkYg4AtIxzB@cluster0.qyayitt.mongodb.net/event-platform?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
