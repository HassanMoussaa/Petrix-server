// In DoctorRoutes.js
const express = require("express");
const router = express.Router();
const DoctorController = require("../controllers/DoctorController");
const checkAuthMiddleware = require("../middleware/check-auth");

router.use(checkAuthMiddleware.checkAuthDoctor);

// Specific to doctors
router.post("/register", DoctorController.register);
router.get("/profile", DoctorController.getMyProfile);

module.exports = router;
