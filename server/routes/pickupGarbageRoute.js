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
    return res.status(400).json({ message: error });
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


    try {
        await newPickup.save();
        return res.status(200).json({ status: "Pickup garbage added successfully" });
    } catch (error) {
        return res.status(500).json({ status: "Error with offering pickup garbage", message: error.message });
    }
});

// Get all pickupgarbage
router.get("/getallpickupgarbage", async (req, res) => {
    try {
        const allpickups = await PickupGarbage.find();
        return res.json(allpickups);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});



router.route('/cancelshedule/:id').put(async (req, res) => {
    const reqID = req.params.id;

    try {
        const updatedAppointment = await PickupGarbage.findByIdAndUpdate(
            reqID,
            { status: "Canceled" },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ status: "req not found" });
        }

        return res.status(200).json({ status: "req cancelled", updatedAppointment });
    } catch (error) {
        return res.status(500).json({ status: "Error cancelling req", message: error.message });
    }
});


// Delete a request item by ID
router.delete('/deletshedule/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`Deleting request with ID: ${id}`);  // Log for debugging

    try {
        const deletedRequest = await PickupGarbage.findByIdAndDelete(id);
        if (!deletedRequest) {
            return res.status(404).json({ status: "PickupGarbage not found" });
        }
        return res.status(200).json({ status: "PickupGarbage deleted" });
    } catch (error) {
        console.error("Error deleting request:", error);
        return res.status(400).json({ status: "Error deleting PickupGarbage", message: error.message });
    }
});






router.get("getbyuserid/:userid", async (req, res) => {
    try {
        const pickup = await PickupGarbage.find({ userid: req.params.userid });
        return res.json(pickup);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}
);

router.route('/updateweights').post(async (req, res) => {
    const { bookingId, weights } = req.body;
    const costPerKg = 250; // LKR 250 per kg

    try {
        // Find the booking by its ID
        const pickup = await PickupGarbage.findById(bookingId);
        if (!pickup) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update the weights and calculate the total cost
        pickup.weights = weights;

        // Calculate total cost based on the weight of each type of garbage
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        const totalCost = totalWeight * costPerKg;
        pickup.totalCost = totalCost;

        await pickup.save();

        return res.status(200).json({ 
            message: 'Weights updated and cost calculated successfully', 
            totalCost: totalCost 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating weights', error: error.message });
    }
 
});


module.exports = router;
