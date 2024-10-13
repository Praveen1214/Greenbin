const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const requestItemSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    factoryName: {
        type: String,
        required: true,
    },
    factoryAddress: {
        type: String,
        required: true,
    },
    beneficiaryName: {
        type: String,
        required: true,
    },
    bank: {
        type: String,
        required: true,
    },
    accountNo: {
        type: String,
        required: true,
    },
    totalSellPrice: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "Pending",
        enum : ["Pending", "Approved", "Rejected", "Canceled"]
    },
});

const RequestItem = mongoose.model('requestitems', requestItemSchema);

module.exports = RequestItem;
