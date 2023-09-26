// In PetOwnerRoutes.js
const express = require("express");
const router = express.Router();
const PetOwnerController = require("../controllers/PetOwnerController");
const checkAuthMiddleware = require("../middleware/check-auth");

router.post("/register", PetOwnerController.register);

router.use(checkAuthMiddleware.checkAuthPetOwner);

// Specific to pet owners

router.get("/myProfile", PetOwnerController.getmyProfile);
router.post("/review/:doctor_id", PetOwnerController.addReview);

router.post("/appointment", PetOwnerController.bookAppointment);

router.get("/availableSlots", PetOwnerController.getAvailableSlots);

router.post("/update_profile", PetOwnerController.updatPetOwnerProfile);

module.exports = router;
