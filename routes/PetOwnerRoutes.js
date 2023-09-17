// In PetOwnerRoutes.js
const express = require("express");
const router = express.Router();
const PetOwnerController = require("../controllers/PetOwnerController");
const checkAuthMiddleware = require("../middleware/check-auth");

router.post("/register", PetOwnerController.register);

router.use(checkAuthMiddleware.checkAuthPetOwner);

// Specific to pet owners

router.get("/myProfile", PetOwnerController.getmyProfile);
router.post("/appointment", PetOwnerController.bookAppointment);

router.get("/availableSlots", PetOwnerController.getAvailableSlots);

module.exports = router;
