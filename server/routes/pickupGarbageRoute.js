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





module.exports = router;
