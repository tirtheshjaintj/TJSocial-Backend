"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./../controllers/user.controller");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authcheck_1 = __importDefault(require("../middlewares/authcheck"));
const user_controller_2 = require("../controllers/user.controller");
const validate_1 = __importDefault(require("../middlewares/validate"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const userRouter = (0, express_1.Router)();
userRouter.get("/", authcheck_1.default, user_controller_2.getUser);
userRouter.get("/user/:username", (0, express_validator_1.param)('username').matches(/^\S+$/).withMessage('Username must not have spaces').isLength({ min: 3 }).withMessage('Username must be atleast length 3'), validate_1.default, authcheck_1.default, user_controller_1.getUserByUserName);
userRouter.post("/signup", [
    (0, express_validator_1.body)('name').matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only letters and spaces.').isLength({ min: 3 }).withMessage('Name must contain only letters and spaces.'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address.'),
    (0, express_validator_1.body)('phone_number').matches(/^[0-9]{10}$/).withMessage('Phone number must contain exactly 10 digits.'),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
    (0, express_validator_1.body)('username').matches(/^\S+$/).withMessage('Username must not have spaces').isLength({ min: 3 }).withMessage('Username must be atleast length 3'), (0, express_validator_1.body)('dob')
        .isISO8601().withMessage('Date must be in YYYY-MM-DD format')
        .custom((value) => {
        const dob = new Date(value);
        const today = new Date();
        const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
        const HundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        return dob <= thirteenYearsAgo || dob > HundredYearsAgo;
    }).withMessage('You must be at least 13 years old or less than 100')
], validate_1.default, user_controller_2.signup);
userRouter.post("/login", [
    (0, express_validator_1.body)('email').isEmail().withMessage('Wrong Credentials'),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Wrong Credentials'),
], validate_1.default, user_controller_2.login);
userRouter.patch("/update", multer_1.default.fields([
    { name: 'profile_pic', maxCount: 1 },
    { name: 'cover_pic', maxCount: 1 }
]), [
    (0, express_validator_1.body)('name').matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only letters and spaces.').isLength({ min: 3 }).withMessage('Name must contain only letters and spaces.'),
    (0, express_validator_1.body)('username').matches(/^\S+$/).withMessage('Username must not have spaces').isLength({ min: 3 }).withMessage('Username must be atleast length 3'),
    (0, express_validator_1.body)('dob')
        .isISO8601().withMessage('Date must be in YYYY-MM-DD format')
        .custom((value) => {
        const dob = new Date(value);
        const today = new Date();
        const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
        return dob <= thirteenYearsAgo;
    }).withMessage('You must be at least 13 years old'),
    (0, express_validator_1.body)("account_type").isIn(['public', 'private'])
        .withMessage('Type must be either "public" or "private"'),
], validate_1.default, authcheck_1.default, user_controller_2.updateUser);
userRouter.post("/verify-otp/:user_id", [
    (0, express_validator_1.param)("user_id").isMongoId().withMessage("Not Valid ID"),
    (0, express_validator_1.body)('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.'),
], validate_1.default, user_controller_1.verifyOTP);
userRouter.post("/resend-otp/:user_id", (0, express_validator_1.param)("user_id").isMongoId().withMessage("Not Valid ID"), validate_1.default, user_controller_1.resendOTP);
userRouter.post("/change-password", [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address.'),
    (0, express_validator_1.body)('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.'),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
], validate_1.default, user_controller_1.changePassword);
userRouter.post("/forgot-password", (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address.'), user_controller_1.forgotPassword);
userRouter.post('/google_login', [
    (0, express_validator_1.body)("token").isJWT().withMessage("Not Valid JWT")
], validate_1.default, user_controller_1.google_login);
userRouter.post("/username", (0, express_validator_1.body)('username').matches(/^\S+$/).withMessage('Username must not have spaces').isLength({ min: 3 }).withMessage('Username must be atleast length 3'), validate_1.default, user_controller_1.checkUsername);
userRouter.post('/logout', user_controller_1.logOut);
exports.default = userRouter;
