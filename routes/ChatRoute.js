const express = require("express");
const router = express.Router();
const checkAuthMiddleware = require("../middleware/check-auth");
const { getChatGPT } = require("../controllers/ChatController");
router.use(checkAuthMiddleware.checkAuth);

router.post("/chatgpt", getChatGPT);

module.exports = router;
