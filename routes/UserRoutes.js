// In UserRoutes.js (Common routes)
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const checkAuthMiddleware = require("../middleware/check-auth");
const ProfilePictureUploader = require("../middleware/profile-picture-uploader");
const PetPictureUploader = require("../middleware/pet-picture-uploader");

router.post("/login", UserController.login);
router.get("/topDoctors", UserController.getTopDoctors);

router.use(checkAuthMiddleware.checkAuth);

// Common routes
router.post("/follow", UserController.followUser);
router.post("/unfollow", UserController.unfollowUser);
router.get("/doctorProfile/:id", UserController.getDoctorProfile);
router.get("/petOwnerProfile/:id", UserController.getPetOwnerProfile);
router.post(
  "/profilePicture",
  ProfilePictureUploader.upload.single("image"),
  UserController.changeProfilePicture
);

router.get("/post/:postId", UserController.getDoctorPost);

router.post("/like", UserController.likePost);
router.post("/unlike", UserController.unlikePost);
router.post("/comment", UserController.createComment);
router.get("/comments/:postId", UserController.getPostComments);

router.delete("/comment/:id", UserController.deleteComment);

router.put("/comment/:id", UserController.editComment);

router.get("/search/:keyword", UserController.searchUsers);
router.post("/save_notification_token", UserController.saveNotificationToken);

router.get("/doctors_near_you", UserController.getDoctorsNearYou);

router.post(
  "/save_pet",
  PetPictureUploader.upload.single("image"),
  UserController.savePet
);

module.exports = router;
