// In DoctorRoutes.js
const express = require("express");
const router = express.Router();
const DoctorController = require("../controllers/DoctorController");
const checkAuthMiddleware = require("../middleware/check-auth");

router.post("/register", DoctorController.register);

router.use(checkAuthMiddleware.checkAuthDoctor);

// Specific to doctors

router.get("/myProfile", DoctorController.getMyProfile);
router.get("/posts", DoctorController.getDoctorPosts);
router.post("/post", DoctorController.createDoctorPost);
router.put("/post/:id", DoctorController.editDoctorPost);

router.get("/appointments", DoctorController.getPendingAppointments);
router.put("/acceptAppointment", DoctorController.acceptAppointment);
router.put("/rejectAppointment", DoctorController.rejectAppointment);
router.get("/acceptedAppointments", DoctorController.getAcceptedAppointments);
router.post("/availability", DoctorController.setAvailability);

module.exports = router;
