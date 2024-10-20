const express = require("express");
const cors = require('cors');
require("dotenv").config();

// Import database connection
require("./db");

const app = express();

// Middleware
app.use(express.json());  // To parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS

// Import routes
const PassengerRoute = require('./routes/PassengerRoute');
const pickUpGarbage = require("./routes/pickupGarbageRoute")
const RequestItemRoute = require("./routes/RequestItemRoute")
const managerRoute = require("./routes/Emp_route")

// Use routes
app.use('/api/passenger', PassengerRoute);
app.use('/api/pickupgarbage', pickUpGarbage);
app.use('/api/requestitem', RequestItemRoute);
app.use('/api/managers', managerRoute);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
