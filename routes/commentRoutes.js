const express = require("express");
const router = express.Router();
const { authGuard, adminGuard } = require("../middleware/authMiddleware");
const {
    createComment,
    updateComment,
    deleteComment,
    getComment,
} = require("../controllers/commentControllers");

router.post("/", authGuard, createComment);
router.get("/:email", authGuard, adminGuard, getComment);
router
    .route("/:commentId")
    .put(authGuard, updateComment)
    .delete(authGuard, deleteComment);

module.exports = router;
