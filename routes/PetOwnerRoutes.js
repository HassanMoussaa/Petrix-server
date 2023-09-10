// In PetOwnerRoutes.js
const express = require("express");
const router = express.Router();
const PetOwnerController = require("../controllers/PetOwnerController");
const checkAuthMiddleware = require("../middleware/check-auth");

router.post("/register", PetOwnerController.register);

router.use(checkAuthMiddleware.checkAuthPetOwner);

// Specific to pet owners

router.get("/myProfile", PetOwnerController.getmyProfile);
router.get("/appointment", PetOwnerController.bookAppointment);

module.exports = router;
