"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.checkUsername = exports.resendOTP = exports.changePassword = exports.forgotPassword = exports.verifyOTP = exports.google_login = exports.updateUser = exports.login = exports.getUserByUserName = exports.getUser = exports.signup = void 0;
const jwt_helper_1 = require("../helpers/jwt.helper");
const mail_helper_1 = require("../helpers/mail.helper");
const user_model_1 = __importDefault(require("../models/user.model"));
const crypto_1 = __importDefault(require("crypto"));
const error_helper_1 = require("../helpers/error.helper");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cloud_helper_1 = __importDefault(require("../helpers/cloud.helper"));
const google_auth_library_1 = require("google-auth-library");
const follow_model_1 = __importDefault(require("../models/follow.model"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const fullUser = async (user, user_id = null) => {
    let following = false;
    if (user_id) {
        const followCheck = await follow_model_1.default.findOne({ user_id, follow_id: user._id });
        if (followCheck)
            following = true;
    }
    // Fetch followers and populate user info
    const followers = await follow_model_1.default.find({ follow_id: user._id })
        .populate({
        path: "user_id",
        select: "name profile_pic username -_id"
    })
        .lean();
    // Fetch following and populate followed user info
    const followings = await follow_model_1.default.find({ user_id: user._id })
        .populate({
        path: "follow_id",
        select: "name profile_pic username _id"
    })
        .lean();
    return {
        ...user,
        follower_count: followers.length,
        following_count: followings.length,
        following,
        followers,
        followings,
    };
};
async function checkIfUnique(field, value, currentValue, label) {
    if (value !== currentValue) {
        const query = { [field]: value, verified: true };
        const existing = await user_model_1.default.findOne(query);
        if (existing)
            throw new error_helper_1.AppError(`Account already exists with this ${label}`, 401);
    }
}
exports.signup = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, password, phone_number, username, dob } = req.body;
    const exisitinguser = await user_model_1.default.findOne({
        $or: [
            { email },
            { phone_number },
            { username }
        ],
        verified: true
    });
    if (exisitinguser)
        throw new error_helper_1.AppError("Account Exists with Email or Phone Number", 401);
    const otp = crypto_1.default.randomInt(100000, 999999).toString(); // Generate OTP
    await user_model_1.default.deleteMany({
        $or: [
            { email },
            { phone_number },
            { username }
        ],
        verified: false
    });
    const trimmed = name.trim().toLowerCase();
    const formatted = trimmed
        .split(/\s+/) // split by one or more spaces
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    const user = await user_model_1.default.create({ name: formatted, email, password, phone_number, username, dob: new Date(dob), otp });
    const mailStatus = await (0, mail_helper_1.sendOTP)(user.email, otp);
    if (!mailStatus)
        throw new Error('Failed to send OTP.');
    user.password = "";
    res.status(201).json({ status: true, message: 'Verification is Needed!', data: user._id });
});
exports.getUser = (0, express_async_handler_1.default)(async (req, res) => {
    const userData = await fullUser(req.user);
    console.log(userData);
    res.json({
        status: true,
        message: "User Fetched",
        data: userData
    });
});
exports.getUserByUserName = (0, express_async_handler_1.default)(async (req, res) => {
    const { username } = req.params;
    console.log(username);
    const user = await user_model_1.default.findOne({ username, verified: true, account_type: "public" }).lean();
    if (!user)
        throw new error_helper_1.AppError("User Not Found", 404);
    user.password = "";
    //@ts-ignore
    const userData = await fullUser(user, req.user._id);
    console.log(userData);
    res.json({
        status: true,
        message: "User Fetched",
        data: userData
    });
});
exports.login = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await user_model_1.default.findOne({
        email,
        verified: true
    });
    console.log(user);
    if (!user)
        throw new error_helper_1.AppError("Wrong Credentials", 401);
    const isMatch = await user?.isPasswordCorrect(password);
    if (!isMatch)
        throw new error_helper_1.AppError("Wrong Credentials", 401);
    const token = (0, jwt_helper_1.setUser)(user);
    const mailStatus = await (0, mail_helper_1.sendEmail)(`Dear ${user?.name},You Logged In as User on new Device`, email, `<h1>Dear ${user?.name},\n\nYour account has been logged in on a new device.\n\nIf this wasn't you, please contact our support team immediately.</h1>`);
    if (!mailStatus)
        throw new Error("Email Not Sent");
    res.cookie('user_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365
    });
    user.password = "";
    const userData = await fullUser(user.toObject());
    console.log(userData);
    res.status(200).json({
        status: true, message: 'Account Login Successfully', data: userData
    });
});
exports.updateUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, account_type, bio, username, dob } = req.body;
    const user_id = req.user._id;
    const profile_pic = req.files?.['profile_pic']?.[0];
    const cover_pic = req.files?.['cover_pic']?.[0];
    let profile_url, cover_url;
    await checkIfUnique('username', username, req.user.username, 'username');
    if (profile_pic)
        profile_url = await (0, cloud_helper_1.default)(profile_pic.buffer);
    if (cover_pic)
        cover_url = await (0, cloud_helper_1.default)(cover_pic.buffer);
    // 🧠 Build update object conditionally
    const updateData = {
        name,
        bio,
        account_type,
        username,
        dob
    };
    if (profile_url)
        updateData.profile_pic = profile_url;
    if (cover_url)
        updateData.cover_pic = cover_url;
    const user = await user_model_1.default.findOneAndUpdate({ _id: user_id, verified: true }, updateData, { new: true, runValidators: true });
    if (!user)
        throw new error_helper_1.AppError("Not Authorized to Update");
    const mailStatus = await (0, mail_helper_1.sendEmail)(`Dear ${user?.name} Your Account is Updated`, user?.email, `<h1>Dear ${user?.name},\n\nYour account has been update.\n\nIf this wasn't you, please contact our support team immediately.</h1>`);
    if (!mailStatus)
        throw new Error("Email Not Sent");
    user.password = "";
    const userData = await fullUser(user.toObject());
    res.status(200).json({
        status: true,
        message: 'User details updated successfully!',
        data: userData
    });
});
async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload(); // Safe, verified info
        return payload; // Contains email, name, sub, etc.
    }
    catch (error) {
        throw new error_helper_1.AppError("Not valid Google Login", 401);
    }
}
exports.google_login = (0, express_async_handler_1.default)(async (req, res) => {
    const { token } = req.body;
    const details = await verifyGoogleToken(token);
    const { email, name, sub: google_id } = details;
    const sanitized_name = name.replace(/[^a-zA-Z\s]/g, "").trim();
    let user = await user_model_1.default.findOne({ email: email, verified: true });
    if (!user) {
        // Generate random details for signup
        const randomPassword = Math.random().toString(36).slice(-8);
        const randomPhoneNumber = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
        const username = email.split("@")[0] + new Date().getMilliseconds();
        console.log(username);
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);
        const dob = today.getFullYear() +
            '-' +
            String(today.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(today.getDate()).padStart(2, '0');
        user = await user_model_1.default.create({
            name: sanitized_name,
            email,
            username,
            google_id,
            dob,
            phone_number: randomPhoneNumber,
            password: randomPassword,
            verified: true
        });
        await (0, mail_helper_1.sendEmail)("You Logged In as User on new Device!", user.email, `Dear ${user.name},\n\nYour account has been successfully created via Google Login.\n\nLogin Details:\nEmail: ${email}\nTemporary Password: ${randomPassword}\n\nPlease change your password after login.`);
    }
    else {
        if (user.google_id && user.google_id !== google_id)
            throw new error_helper_1.AppError('Invalid Google ID', 401);
        await user_model_1.default.findByIdAndUpdate(user._id, {
            google_id,
            otp: null,
            verified: true
        });
    }
    const mailStatus = await (0, mail_helper_1.sendEmail)(`Dear ${user?.name} You Logged In as User on new Device`, email, `Dear ${user.name},\n\nYour account has been logged in on a new device.\n\nIf this wasn't you, please contact our support team immediately.`);
    if (!mailStatus)
        throw new Error("Email Not Sent");
    const auth_token = (0, jwt_helper_1.setUser)(user);
    res.cookie('user_token', auth_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 day
    });
    user.password = "";
    const userData = await fullUser(user.toObject());
    res.status(200).json({ status: true, message: 'Google Login successful!', data: userData });
});
exports.verifyOTP = (0, express_async_handler_1.default)(async (req, res) => {
    const { otp } = req.body;
    const { user_id } = req.params;
    const user = await user_model_1.default.findOne({ _id: user_id, otp, verified: false });
    if (!user)
        throw new error_helper_1.AppError("Invalid OTP Try Again", 401);
    await user_model_1.default.findByIdAndUpdate(user._id, {
        verified: true,
        otp: null
    });
    const mailStatus = await (0, mail_helper_1.sendEmail)(`${user.name} Account Verified`, user.email, `<h1>Account Verified</h1>`);
    if (!mailStatus)
        throw new Error("Email Not Sent");
    const token = (0, jwt_helper_1.setUser)(user);
    res.cookie('user_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 day
    });
    user.password = "";
    const userData = await fullUser(user.toObject());
    res.status(200).json({
        status: true, message: 'Account Created Successfully', data: userData
    });
});
exports.forgotPassword = (0, express_async_handler_1.default)(async (req, res) => {
    const { email } = req.body;
    const user = await user_model_1.default.findOne({ email, verified: true });
    if (!user)
        throw new error_helper_1.AppError("Invalid Account", 401);
    const otp = crypto_1.default.randomInt(100000, 999999).toString(); // Generate OTP
    await user_model_1.default.findByIdAndUpdate(user._id, {
        otp
    }, { new: true });
    const mailStatus = await (0, mail_helper_1.sendOTP)(user.email, otp);
    if (!mailStatus)
        throw new Error('Failed to send OTP.');
    res.status(200).json({ status: true, message: "OTP Sent Scuccessfully", data: user._id });
});
exports.changePassword = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, otp, password } = req.body;
    const user = await user_model_1.default.findOne({ email, otp, verified: true });
    console.log(email, otp, password);
    if (!user)
        throw new error_helper_1.AppError("Invalid OTP", 401);
    user.otp = null;
    user.password = password;
    await user.save();
    const mailStatus = await (0, mail_helper_1.sendEmail)(`${user.name} Password Changed Successfully ✅`, user.email, `<h1>${user.name} Password Changed Successfully ✅</h1>`);
    if (!mailStatus)
        throw new Error("Email Not Sent");
    res.status(200).json({ status: true, message: "Password updated successfully" });
});
exports.resendOTP = (0, express_async_handler_1.default)(async (req, res) => {
    const { user_id } = req.params;
    const user = await user_model_1.default.findOne({ _id: user_id, verified: false });
    if (!user)
        throw new error_helper_1.AppError("Invalid Account", 401);
    const otp = crypto_1.default.randomInt(100000, 999999).toString(); // Generate OTP
    await user_model_1.default.findByIdAndUpdate(user._id, {
        otp
    });
    const mailStatus = await (0, mail_helper_1.sendOTP)(user.email, otp);
    if (!mailStatus)
        throw new Error('Failed to send OTP.');
    res.status(200).json({ status: true, message: "OTP Resent Scuccessfully" });
});
exports.checkUsername = (0, express_async_handler_1.default)(async (req, res) => {
    const { username } = req.body;
    const currentuser = req.user;
    const user = await user_model_1.default.findOne({ username, verified: true });
    if (currentuser && currentuser.username == username)
        res.status(200).json({ status: false, message: "Username Available" });
    if (user)
        res.status(401).json({ status: false, message: "Username Already Taken" });
    res.status(200).json({ status: true, message: "Username Available", data: username });
});
exports.logOut = (0, express_async_handler_1.default)(async (req, res) => {
    res.clearCookie('user_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
    });
    res.status(200).json({ status: true, message: "User logged out" });
});
