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


router.route('/getallrequestitems/:contact').get(async (req, res) => {

    const usercontact = req.params.contact;

    try {

        const req = await RequestItem.find({ contact: usercontact });

        if (!req) {
            return res.status(404).json({ status: "req not found" });
        }

        return res.status(200).json({ status: "req is fatched", req });

    } catch (error) {

        return res.status(500).json({ status: "Error with fetch req", message: error });

    }
});

router.route('/updaterequest/:id').put(async (req, res) => {

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
    }

    try {

        await RequestItem.findByIdAndUpdate(reqID, editreq);
        return res.status(200).json({ status: "req updated" });

    } catch (error) {

        return res.status(500).json({ status: "Error with update req", message: error });

    }
});

router.route('/cancelrequest/:id').put(async (req, res) => {
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

router.route('/deleterequest/:id').delete(async (req, res) => {

    const reqId = req.params.id;

    try {

        await RequestItem.findByIdAndDelete(reqId);
        return res.status(200).json({ status: "req is deleted" });

    } catch (error) {

        return res.status(400).json({ status: "Error with delete req", message: error });

    }
});





module.exports = router;