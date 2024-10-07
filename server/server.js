const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());  // To parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS

// MongoDB connection
const mongoURL = process.env.MONGODB_URI;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("error", (err) => {
  console.log("MongoDB Connection Failed", err);
});

connection.on("connected", () => {
  console.log("MongoDB Connection Successful");
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Import routes
const PassengerRoute = require('./routes/PassengerRoute');

// Use routes
app.use('/api/passenger', PassengerRoute);
