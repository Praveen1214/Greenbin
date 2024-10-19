const express = require('express');
const router = express.Router();
const RequestItem = require('../models/RequestItem');

// Get all request items, sorted by creation date
router.get('/request-items', async (req, res) => {
    try {
        const requestItems = await RequestItem.find().sort({ createdAt: -1 });
        res.json(requestItems);
    } catch (error) {
        console.error('Error fetching request items:', error);
        res.status(500).json({ message: 'Failed to fetch request items', error: error.message });
    }
});

// Post a new request item
router.post('/request-item', async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const {
            category,
            quantity,
            factoryName,
            factoryAddress,
            beneficiaryName,
            bank,
            accountNo,
            totalSellPrice,
            contact
        } = req.body;

        const newRequestItem = new RequestItem({
            category,
            quantity,
            factoryName,
            factoryAddress,
            beneficiaryName,
            bank,
            accountNo,
            totalSellPrice,
            contact
        });

        const savedItem = await newRequestItem.save();
        console.log("Saved item:", savedItem);

        res.status(201).json({ message: 'Request item created successfully', item: savedItem });
    } catch (error) {
        console.error('Error creating request item:', error);
        res.status(500).json({ message: 'Failed to create request item', error: error.message });
    }
});

// Get all request items without sorting
router.get("/getallrequestitems", async (req, res) => {
    try {
        const allrequest = await RequestItem.find();
        return res.json(allrequest);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Get request items by user contact
router.get('/getallrequestitems/:contact', async (req, res) => {
    const usercontact = req.params.contact;
    try {
        const reqItems = await RequestItem.find({ contact: usercontact });

        if (reqItems.length === 0) {
            return res.status(404).json({ status: "req not found" });
        }

        return res.status(200).json({ status: "req is fatched", req: reqItems });
    } catch (error) {
        return res.status(500).json({ status: "Error with fetch req", message: error.message });
    }
});

// Update request by ID
router.put('/updaterequest/:id', async (req, res) => {
    const reqID = req.params.id;
    const {
        category,
        quantity,
        factoryName,
        factoryAddress,
        beneficiaryName,
        bank,
        accountNo,
        totalSellPrice,
        contact
    } = req.body;

    const editreq = {
        category,
        quantity,
        factoryName,
        factoryAddress,
        beneficiaryName,
        bank,
        accountNo,
        totalSellPrice,
        contact
    };

    try {
        await RequestItem.findByIdAndUpdate(reqID, editreq);
        return res.status(200).json({ status: "req updated" });
    } catch (error) {
        return res.status(500).json({ status: "Error with update req", message: error.message });
    }
});

// Cancel a request by ID
router.put('/cancelrequest/:id', async (req, res) => {
    const reqID = req.params.id;
    try {
        const updatedAppointment = await RequestItem.findByIdAndUpdate(
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

// Delete a request by ID
router.delete('/deleterequest/:id', async (req, res) => {
    const reqId = req.params.id;
    try {
        await RequestItem.findByIdAndDelete(reqId);
        return res.status(200).json({ status: "req is deleted" });
    } catch (error) {
        return res.status(400).json({ status: "Error with delete req", message: error.message });
    }
});

module.exports = router;
