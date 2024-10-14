const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});

const pickUpGarbageSchema = new Schema({
    userid: {
        type: String,
    },
    location: {
        type: locationSchema,
        
    },
    garbagetypes: {
        type: [String],  // Accept array of strings
        
        enum: ['Papers', 'Plastic', 'Mentol', 'Cloths', 'E waste', 'Glass']
    },
    message: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        default: "Pending",
    },
    date: {
        type: String,
        required: false,
    },
    weights: {
        type: Map,  // A map where key is the garbage type and value is the weight in kg
        of: Number,
        default: {},
    },
    totalCost: {
        type: Number,
        default: 0,
    },
});

const PickupGarbage = mongoose.model('pickupgarbage', pickUpGarbageSchema);

module.exports = PickupGarbage;
