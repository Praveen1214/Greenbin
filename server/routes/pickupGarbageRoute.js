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

module.exports = router;
