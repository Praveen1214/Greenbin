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
        return res.status(200).json({ status: "User is registered successfully" });

    } catch (error) {

        return res.status(500).json({ status: "Error with register User", messsage: error });
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

// Get all users
router.get("/getallusers", async (req, res) => {
    try {
        const allusers = await Passengers.find();
        return res.json(allusers);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});



// Fetch user profile for QR code
router.get('/getProfile/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const userProfile = await Passengers.findById(userId);
        if (!userProfile || userProfile === null) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return the user profile
        return res.status(200).json(userProfile);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
});

router.put('/changerole/:id', async (req, res) => {
    const reqID = req.params.id;

    try {
        // Update role to "Driver"
        const updatedRole = await Passengers.findByIdAndUpdate(
            reqID,
            { role: "Driver" }, // Set role to Driver
            { new: true } // Return the updated document
        );

        if (!updatedRole) {
            return res.status(404).json({ status: "User not found" });
        }

        return res.status(200).json({ status: "Role updated successfully", updatedRole });
    } catch (error) {
        return res.status(500).json({ status: "Error updating role", message: error.message });
    }
});

// Delete a request item by ID
router.delete('/deleteuser/:id', async (req, res) => {
    const id = req.params.id;
    console.log(`Deleting request with ID: ${id}`);  // Log for debugging

    try {
        const deletedRequest = await Passengers.findByIdAndDelete(id);
        if (!deletedRequest) {
            return res.status(404).json({ status: "Request not found" });
        }
        return res.status(200).json({ status: "Request deleted" });
    } catch (error) {
        console.error("Error deleting request:", error);
        return res.status(400).json({ status: "Error deleting request", message: error.message });
    }
});

  



module.exports = router;