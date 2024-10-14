const express = require('express');
const router = express.Router();
const Passengers = require('../models/Passenger');

router.route('/register').post(async (req, res) => {

    const {
        firstname,
        lastname,
        email,
        gender,
        contact,
    } = req.body;

    const newPassenger = new Passengers({
        firstname,
        lastname,
        email,
        gender,
        contact,
    });

    try {

        await newPassenger.save();
        return res.status(200).json({ status: "Passenger is registered successfully" });

    } catch (error) {

        return res.status(500).json({ status: "Error with register passenger", messsage: error });
    }
});

router.route('/login').post(async (req, res) => {

    const {
        contact
    } = req.body;

    try {
        const passenger = await Passengers.findOne({ contact : contact });

        if (passenger) {

            const loginPassenger = {

                _id: passenger._id,
                firstname: passenger.firstname,
                lastname: passenger.lastname,
                email: passenger.email,
                gender: passenger.gender,
                contact: passenger.contact,
                role: passenger.role

            }

            return res.status(200).json({ status: "Login Success", loginPassenger });
        }
        else {
            return res.status(500).json({ status: "The contact is incorrect" });
        }

    } catch (error) {
        return res.status(500).json({ status: "Error during login", message: error });
    }
});

// Fetch user profile for QR code
router.get('/getProfile/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const userProfile = await Passengers.findById(userId);
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return the user profile
        return res.status(200).json(userProfile);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
});




module.exports = router;