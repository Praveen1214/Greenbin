const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  managerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  departmentId: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    addressLine: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    division: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: 'manager',
    enum: ['manager', 'admin']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'suspend']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Manager = mongoose.model('employees', managerSchema);

module.exports = Manager;