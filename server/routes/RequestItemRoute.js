const express = require('express');
const router = express.Router();
const RequestItem = require('../models/RequestItem');

router.get('/request-items', async (req, res) => {
    try {
      const requestItems = await RequestItem.find().sort({ createdAt: -1 });
      res.json(requestItems);
    } catch (error) {
      console.error('Error fetching request items:', error);
      res.status(500).json({ message: 'Failed to fetch request items', error: error.message });
    }
  });

  router.get('/request-items', async (req, res) => {
    try {
      const requestItems = await RequestItem.find();
      res.status(200).json(requestItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.post('/request-item', async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const {
            category,
            quantity,
            factoryAddress,
            beneficiaryName,
            bank,
            accountNo,
            totalSellPrice,
        } = req.body;

        const newRequestItem = new RequestItem({
            category,
            quantity,
            factoryAddress,
            beneficiaryName,
            bank,
            accountNo,
            totalSellPrice,
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