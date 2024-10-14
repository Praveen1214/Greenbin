const express = require('express');
const router = express.Router();
const PickupGarbage = require('../models/PickupGarbageModel');

router.route('/addpickupgarbage').post(async (req, res) => {
    const {
        userid,
        location,
        garbagetypes,
        message,
        status,
        date,
    } = req.body;

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
