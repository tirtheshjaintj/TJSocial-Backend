import { changePassword, checkUsername, forgotPassword, getUserByUserName, google_login, logOut, resendOTP, verifyOTP } from './../controllers/user.controller';
import { Router } from "express";
import { body, param } from "express-validator";
import authcheck from "../middlewares/authcheck";
import { getUser, login, signup, updateUser } from "../controllers/user.controller";
import validate from "../middlewares/validate";
import upload from "../middlewares/multer";

const userRouter = Router();

userRouter.get("/", authcheck, getUser);

userRouter.get("/user/:username",
    param('username').matches(/^\S+$/).withMessage('Username must not have spaces').isLength({ min: 3 }).withMessage('Username must be atleast length 3'),
    validate, authcheck, getUserByUserName);

userRouter.post("/signup", [
    body('name').matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only letters and spaces.').isLength({ min: 3 }).withMessage('Name must contain only letters and spaces.'),
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('phone_number').matches(/^[0-9]{10}$/).withMessage('Phone number must contain exactly 10 digits.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
    body('username').matches(/^\S+$/).withMessage('Username must not have spaces').isLength({ min: 3 }).withMessage('Username must be atleast length 3'), body('dob')
        .isISO8601().withMessage('Date must be in YYYY-MM-DD format')
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            const thirteenYearsAgo = new Date(
                today.getFullYear() - 13,
                today.getMonth(),
                today.getDate()
            );
            const HundredYearsAgo = new Date(
                today.getFullYear() - 100,
                today.getMonth(),
                today.getDate()
            );
            return dob <= thirteenYearsAgo || dob > HundredYearsAgo;
        }).withMessage('You must be at least 13 years old or less than 100')
]
    , validate, signup);

userRouter.post("/login", [
    body('email').isEmail().withMessage('Wrong Credentials'),
    body('password').isLength({ min: 8 }).withMessage('Wrong Credentials'),
], validate, login);

userRouter.patch("/update", upload.fields([
    { name: 'profile_pic', maxCount: 1 },
    { name: 'cover_pic', maxCount: 1 }
]), [
    body('name').matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only letters and spaces.').isLength({ min: 3 }).withMessage('Name must contain only letters and spaces.'),
    body('username').matches(/^\S+$/).withMessage('Username must not have spaces').isLength({ min: 3 }).withMessage('Username must be atleast length 3'),
    body('dob')
        .isISO8601().withMessage('Date must be in YYYY-MM-DD format')
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            const thirteenYearsAgo = new Date(
                today.getFullYear() - 13,
                today.getMonth(),
                today.getDate()
            );
            return dob <= thirteenYearsAgo;
        }).withMessage('You must be at least 13 years old'),
    body("account_type").isIn(['public', 'private'])
        .withMessage('Type must be either "public" or "private"'),
], validate, authcheck, updateUser);


userRouter.post("/verify-otp/:user_id", [
    param("user_id").isMongoId().withMessage("Not Valid ID"),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.'),
], validate, verifyOTP);

userRouter.post("/resend-otp/:user_id", param("user_id").isMongoId().withMessage("Not Valid ID"), validate, resendOTP);

userRouter.post("/change-password", [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
], validate, changePassword);

userRouter.post("/forgot-password"
    , body('email').isEmail().withMessage('Please enter a valid email address.')
    , forgotPassword);

userRouter.post('/google_login', [
    body("token").isJWT().withMessage("Not Valid JWT")
], validate, google_login);

userRouter.post("/username"
    , body('username').matches(/^\S+$/).withMessage('Username must not have spaces').isLength({ min: 3 }).withMessage('Username must be atleast length 3')
    , validate
    , checkUsername);

userRouter.post('/logout', logOut);

export default userRouter;