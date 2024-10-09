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
        required: true,
    },
    garbagetypes: {
        type: String,
        required: true,
        enum:['Papers', 'Plastic', 'Mentol', 'Cloths', 'E waste', 'Glass']
    },
    message: {
        type: String,
        required: false,
    },
    date: {
        type: String,
        required: false,
    },
    
});

const Passengers = mongoose.model('pickupgarbage', pickUpGarbageSchema);

module.exports = Passengers;
