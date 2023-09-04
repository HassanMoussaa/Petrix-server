// In DoctorRoutes.js
const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/DoctorController');

// Specific to doctors
// router.post('/register', DoctorController.register);
// router.put('/profile/:id', DoctorController.updateProfile);

module.exports = router;