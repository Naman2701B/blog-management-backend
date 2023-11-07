const express = require("express");
const router = express.Router();
const { authGuard } = require("../middleware/authMiddleware");
const {
    registerUser,
    loginUser,
    userProfile,
    updateProfile,
    updateProfilePicture,
    authGoogle,
} = require("../controllers/userControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authGuard, userProfile);
router.put("/updateProfile", authGuard, updateProfile);
router.put("/updateProfilePicture", authGuard, updateProfilePicture);
router.post("/google", authGoogle);

module.exports = router;
