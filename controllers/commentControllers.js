const Post = require("../models/Posts");
const Comment = require("../models/Comment");
const User = require("../models/User");

const createComment = async (req, res, next) => {
    try {
        const { desc, slug, parent, replyOnUser } = req.body;
        const post = await Post.findOne({ slug: slug });
        if (!post) {
            const error = new Error("Post not found!");
            return next(error);
        }
        const newComment = new Comment({
            user: req.user._id,
            desc,
            post: post._id,
            parent,
            replyOnUser,
        });
        const savedComment = await newComment.save();
        res.json(savedComment);
    } catch (error) {
        next(error);
    }
};

const updateComment = async (req, res, next) => {
    try {
        const { desc } = req.body;
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            const error = new Error("Comment not found!");
            return next(error);
        }
        comment.desc = desc || comment.desc;
        const updatedComment = await comment.save();
        return res.json(updatedComment);
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        await Comment.deleteMany({ parent: comment._id });
        if (!comment) {
            const error = new Error("Comment not found!");
            return next(error);
        }
        return res.json({ message: "The comment is deleted successfully." });
    } catch (error) {
        next(error);
    }
};

const getComment = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        const comments = await Comment.find(
            { user: user._id },
            { desc: 1, createdAt: 1 }
        );
        return res.json(comments);
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { createComment, updateComment, deleteComment, getComment };
