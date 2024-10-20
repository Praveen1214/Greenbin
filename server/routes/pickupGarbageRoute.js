const express = require('express');
const router = express.Router();
const PickupGarbage = require('../models/PickupGarbageModel');

// Add a new pickup request
router.post('/addpickupgarbage', async (req, res) => {
  const { userid, location, garbagetypes, message, status, date } = req.body;
  const newPickup = new PickupGarbage({
    userid,
    location,
    garbagetypes,
    message,
    status,
    date,
  });
  try {
    await newPickup.save();
    return res.status(200).json({ status: 'Pickup garbage added successfully' });
  } catch (error) {
    return res.status(500).json({ status: 'Error adding pickup garbage', message: error.message });
  }
});

// Get all pickup garbage records
router.get('/getallpickupgarbage', async (req, res) => {
  try {
    const allpickups = await PickupGarbage.find();
    return res.json(allpickups);
  } catch (error) {
    return res.status(400).json({ message: 'Database error', error: error.message });
  }
});

// Get pickup garbage by user ID

router.get('/getbyuserid/:userid', async (req, res) => {
  try {
    const pickups = await PickupGarbage.find({ userid: req.params.userid });
    if (pickups.length > 0) {
      return res.json(pickups);
    } else {
      return res.status(404).json({ message: 'No pickups found for this user.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update weights and calculate cost
router.put('/updateweights', async (req, res) => {
  const { bookingId, weights } = req.body;
 
  try {
    const pickup = await PickupGarbage.findById(bookingId);
    if (!pickup) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Implement your weight update and cost calculation logic here
    await pickup.save();
    return res.status(200).json({
      message: 'Weights updated and cost calculated successfully',
      totalCost: totalCost, // Calculate and set this value
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating weights', error: error.message });
  }
});

// Cancel a schedule by ID
router.put('/cancelshedule/:id', async (req, res) => {
  const reqID = req.params.id;
  try {
    const updatedAppointment = await PickupGarbage.findByIdAndUpdate(
      reqID,
      { status: 'Canceled' },
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ status: 'Request not found' });
    }
    return res.status(200).json({ status: 'Request cancelled', updatedAppointment });
  } catch (error) {
    return res.status(500).json({ status: 'Error cancelling request', message: error.message });
  }
});

// Update status to Completed
router.put('/updatestatus/:id', async (req, res) => {
  const reqID = req.params.id;
  try {
    const updatedStatus = await PickupGarbage.findByIdAndUpdate(
      reqID,
      { status: "Completed" },
      { new: true }
    );
    if (!updatedStatus) {
      return res.status(404).json({ status: "Request not found" });
    }
    return res.status(200).json({ status: "Status updated", updatedStatus });
  } catch (error) {
    return res.status(500).json({ status: "Error updating status", message: error.message });
  }
});

// Delete a request by ID
router.delete('/deleteshedule/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedRequest = await PickupGarbage.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ status: 'PickupGarbage not found' });
    }
    return res.status(200).json({ status: 'PickupGarbage deleted' });
  } catch (error) {
    return res.status(400).json({ status: 'Error deleting PickupGarbage', message: error.message });
  }
});


module.exports = router;
