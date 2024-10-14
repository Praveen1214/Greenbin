const express = require('express');
const router = express.Router();
const RequestItem = require('../models/RequestItem');


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


//get all requestitems
router.get("/getallrequestitems",async(req,res)=>{

    try {
        const allrequest = await RequestItem.find()
        return res.json(allrequest);
    } catch (error) {
        return res.status(400).json({massage : error})
    }
});



module.exports = router;