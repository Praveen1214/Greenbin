const express = require('express');
const bcrypt = require('bcrypt');
const Manager = require('../models/Employees'); // Importing the Manager model
const router = express.Router();

// CREATE a new manager
router.post('/addmanagers', async (req, res) => {
  try {
    const { managerId, name, email, password, departmentId, phoneNumber, address } = req.body;

    // Check if email or managerId already exists
    const existingManager = await Manager.findOne({ $or: [{ email }, { managerId }] });
    if (existingManager) {
      return res.status(400).json({ message: 'Manager with this email or managerId already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const manager = new Manager({
      managerId,
      name,
      email,
      password: hashedPassword,
      departmentId,
      phoneNumber,
      address
    });

    await manager.save();
    res.status(201).json(manager);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all managers
router.get('/getallmanagers', async (req, res) => {
  try {
    const managers = await Manager.find();
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ a specific manager by ID
router.get('/managersbyid/:id', async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    res.status(200).json(manager);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a specific manager by ID
// UPDATE a specific manager by ID
router.post('/updatemanager/:id', async (req, res) => {
  try {
    const { name, email, password, departmentId, phoneNumber, address, role, status } = req.body;

    // Find the manager by ID
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    // Update fields
    manager.name = name || manager.name;
    manager.email = email || manager.email;
    manager.departmentId = departmentId || manager.departmentId;
    manager.phoneNumber = phoneNumber || manager.phoneNumber;
    manager.address = address || manager.address;
    manager.role = role || manager.role;
    manager.status = status || manager.status;

    // Update password if provided
    if (password) {
      manager.password = await bcrypt.hash(password, 10);
    }

    await manager.save();
    res.status(200).json(manager);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// TOGGLE manager status (active/suspended)
router.post('/togglemanagerstatus/:id', async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    // Toggle the status between 'active' and 'suspended'
    manager.status = manager.status === 'active' ? 'suspended' : 'active';

    await manager.save();
    res.status(200).json({ message: `Manager ${manager.status === 'active' ? 'activated' : 'suspended'} successfully`, status: manager.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// DELETE a specific manager by ID
router.delete('/deletemanager/:id', async (req, res) => {
  try {
    const manager = await Manager.findByIdAndDelete(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    res.status(200).json({ message: 'Manager deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN route for managers
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the manager by email
    const manager = await Manager.findOne({ email });

    if (manager) {
      // Compare password with hashed password
      const passwordMatch = await bcrypt.compare(password, manager.password);

      if (passwordMatch) {
        const response = {
          managerId: manager.managerId,
          name: manager.name,
          email: manager.email,
          departmentId: manager.departmentId,
          phoneNumber: manager.phoneNumber,
          address: manager.address,
          role: manager.role,
        };
        res.status(200).json(response);
      } else {
        return res.status(400).json({ message: 'Login Failed: Incorrect Password' });
      }
    } else {
      return res.status(400).json({ message: 'Login Failed: Manager Not Found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;