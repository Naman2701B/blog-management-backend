const Likes = require("../models/Likes");
const Post = require("../models/Posts");

const addLikes = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const post = await Post.findOne({ slug: slug });
        if (!post) {
            const error = new Error("Post not found!");
            return next(error);
        } else {
            const likePost = await Likes.findOne({ post: post._id });
            if (!likePost) {
                Likes.create({ post: post._id });
            }
            for (i = 0; i < likePost.user.length; i++) {
                if (likePost.user[i].toString() === req.user._id.toString()) {
                    removeLikes(likePost, req.user._id);
                    return;
                }
            }
            likePost.user.push(req.user._id);
            likePost.count = likePost.count + 1;
            likePost.save();
        }
    } catch (err) {
        next(err);
    }
};
const removeLikes = async (likePost, userid) => {
    likePost.user.remove(userid);
    likePost.count = likePost.count - 1;
    likePost.save();
};

module.exports = { addLikes };
