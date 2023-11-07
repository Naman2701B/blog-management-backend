const uploadPicture = require("../middleware/uploadPictureMiddleware");
const User = require("../models/User");
const fileRemover = require("../utils/fileRemover");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            throw new Error("This user already exists!");
        }
        user = await User.create({
            name,
            email,
            password,
        });
        return res.status(201).json({
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            verified: user.verified,
            admin: user.admin,
            token: await user.generateJWT(),
        });
    } catch (error) {
        next(error);
    }
};
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            throw new Error("Email not found!");
        }
        if (await user.comparePassword(password)) {
            return res.status(201).json({
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
                email: user.email,
                verified: user.verified,
                admin: user.admin,
                token: await user.generateJWT(),
            });
        } else {
            throw new Error("Invalid email or password!");
        }
    } catch (error) {
        next(error);
    }
};
const userProfile = async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id);
        if (user) {
            return res.status(201).json({
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
                email: user.email,
                verified: user.verified,
                admin: user.admin,
                token: await user.generateJWT(),
            });
        } else {
            let error = new Error("User not found!");
            error.statusCode = 404;
            next(error);
        }
    } catch (error) {
        next(error);
    }
};
const updateProfile = async (req, res, next) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) {
            throw new Error("User not found!");
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password && req.body.password.length < 6) {
            throw new Error("Password length must be at least 6 characters.");
        } else if (req.body.password) {
            user.password = req.body.password;
        }
        const updateUSerProfile = await user.save();
        res.json({
            _id: updateUSerProfile._id,
            avatar: updateUSerProfile.avatar,
            name: updateUSerProfile.name,
            email: updateUSerProfile.email,
            verified: updateUSerProfile.verified,
            admin: updateUSerProfile.admin,
            token: await user.generateJWT(),
        });
    } catch (error) {
        next(error);
    }
};
const updateProfilePicture = async (req, res, next) => {
    try {
        const upload = uploadPicture.single("profilePicture");
        upload(req, res, async function (err) {
            if (err) {
                const error = new Error(
                    "An unknown error occurred while uploading!" + err.message
                );
                next(error);
            } else {
                if (req.file) {
                    let filename;
                    let updatedUser = await User.findById(req.user._id);
                    filename = updatedUser.avatar;
                    if (filename) {
                        fileRemover(filename);
                    }
                    updatedUser.avatar = req.file.filename;
                    await updatedUser.save();
                    res.json({
                        _id: updatedUser._id,
                        avatar: updatedUser.avatar,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        verified: updatedUser.verified,
                        admin: updatedUser.admin,
                        token: await updatedUser.generateJWT(),
                    });
                } else {
                    let filename;
                    let updatedUser = await User.findById(req.user._id);
                    filename = updatedUser.avatar;
                    updatedUser.avatar = "";
                    await updatedUser.save();
                    fileRemover(filename);
                    res.json({
                        _id: updatedUser._id,
                        avatar: updatedUser.avatar,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        verified: updatedUser.verified,
                        admin: updatedUser.admin,
                        token: await updatedUser.generateJWT(),
                    });
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
const authGoogle = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        const token = jwt.sign({ id: user.token }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = user._doc;
        return res.status(201).json({
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            verified: user.verified,
            admin: user.admin,
            token: await user.generateJWT(),
        });
    } else {
        const generatedPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            avatar: req.body.photo,
        });
        await newUser.save();
        const { password: pass, ...rest } = newUser._doc;
        return res.status(201).json({
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            verified: user.verified,
            admin: user.admin,
            token: await user.generateJWT(),
        });
    }
};
module.exports = {
    registerUser,
    loginUser,
    userProfile,
    updateProfile,
    updateProfilePicture,
    authGoogle,
};
