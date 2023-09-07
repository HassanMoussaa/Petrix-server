// In UserRoutes.js (Common routes)
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const checkAuthMiddleware = require("../middleware/check-auth");

router.post("/login", UserController.login);

router.use(checkAuthMiddleware.checkAuth);

// Common routes
router.post("/follow", UserController.followUser);
router.post("/unfollow", UserController.unfollowUser);
router.get("/doctorProfile/:id", UserController.getDoctorProfile);
router.get("/petOwnerProfile/:id", UserController.getPetOwnerProfile);

router.post("/like", UserController.likePost);
router.post("/unlike", UserController.unlikePost);
router.post("/addComment", UserController.createComment);

router.delete("/comment/:id", UserController.deleteComment);

module.exports = router;
