const express = require('express');
const router = express.Router();
const pickUpGarbage = require('../models/PickupGarbageModel');

router.route('/addpickupgarbage').post(async (req, res) => {

    const {
        userid,
        location,
        garbagetypes,
        message,
        date,
       
    } = req.body;

    const newPickup = new pickUpGarbage({
        userid,
        location,
        garbagetypes,
        message,
        date,
    });

    try {

        await newPickup.save();
        return res.status(200).json({ status: "Pickup garbage added successfully" });

    } catch (error) {

        return res.status(500).json({ status: "Error with offering pickup garbage", messsage: error });
    }
});

//get all pickupgarbage
router.get("/getallpickupgarbage",async(req,res)=>{

    try {
        const allpickups = await pickUpGarbage.find()
        return res.json(allpickups);
    } catch (error) {
        return res.status(400).json({massage : error})
    }
});


module.exports = router;