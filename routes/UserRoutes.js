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

module.exports = router;
