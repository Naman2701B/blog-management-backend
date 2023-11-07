const express = require("express");
const router = express.Router();
const { authGuard, adminGuard } = require("../middleware/authMiddleware");
const {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getAllPost,
    getAllPostOfUser,
    textToSpeech,
    sentimentAnalyzer,
    getInsightData,
} = require("../controllers/postControllers");
const { addLikes } = require("../controllers/likesController");

router.route("/").post(authGuard, adminGuard, createPost).get(getAllPost);
router.route("/manage").get(authGuard, getAllPostOfUser);
router
    .route("/:slug")
    .delete(authGuard, adminGuard, deletePost)
    .put(authGuard, adminGuard, updatePost)
    .get(getPost, textToSpeech)
    .post(sentimentAnalyzer);
router.route("/:slug/likes").put(authGuard, adminGuard, addLikes);
router.route("/insights/:email").get(authGuard, adminGuard, getInsightData);

module.exports = router;
