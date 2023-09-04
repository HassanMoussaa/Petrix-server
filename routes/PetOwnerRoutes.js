// In PetOwnerRoutes.js
const express = require('express');
const router = express.Router();
const PetOwnerController = require('../controllers/PetOwnerController');

// Specific to pet owners
router.post('/register', PetOwnerController.register);
// router.put('/profile/:id', PetOwnerController.updateProfile);

module.exports = router;