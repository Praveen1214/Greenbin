const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const passengerSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    contact: {
        type: String,
        required: true,
    },   
    role: {
        type: String,
        default: 'Passenger',
        enum: ['Passenger', 'Driver']
    }
});

const Passengers = mongoose.model('passengers', passengerSchema);

module.exports = Passengers;
