const mongoose = require("mongoose");

const LikesSchema = new mongoose.Schema(
    {
        user: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: false,
            },
        ],
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: false,
        },
        count: { type: Number, default: 0, required: true },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);
const Likes = mongoose.model("Likes", LikesSchema);

module.exports = Likes;
