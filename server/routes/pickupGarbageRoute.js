const express = require('express');
const router = express.Router();
const PickupGarbage = require('../models/PickupGarbageModel');

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

router.get('/getallpickupgarbage', async (req, res) => {
  try {
    const allpickups = await PickupGarbage.find();
    return res.json(allpickups);
  } catch (error) {
    return res.status(400).json({ message: 'Database error', error: error.message });
  }
});


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

router.post('/updateweights', async (req, res) => {
  const { userId, weights } = req.body; // Get requestId (pickup ID) and weights
  const costPerKg = 250; // LKR 250 per kg

  try {
    const pickup = await PickupGarbage.findById(userId); // Use requestId to find the booking
    if (!pickup) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update the weights and calculate the total cost
    pickup.weights = weights;
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const totalCost = totalWeight * costPerKg;
    pickup.totalCost = totalCost;

    await pickup.save();

    return res.status(200).json({
      message: 'Weights updated and cost calculated successfully',
      totalCost: totalCost,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating weights', error: error.message });
  }
});

module.exports = router;
