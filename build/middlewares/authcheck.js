"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_helper_1 = require("../helpers/error.helper");
const jwt_helper_1 = require("../helpers/jwt.helper");
const user_model_1 = __importDefault(require("../models/user.model"));
const authcheck = async (req, res, next) => {
    const { authorization } = req.headers;
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.substring(7);
    }
    if (req.cookies && req.cookies.user_token) {
        token = req.cookies.user_token;
        console.log(token);
    }
    console.log(req.cookies);
    if (!token)
        throw new error_helper_1.AppError("Not Authorized", 401);
    const user = (0, jwt_helper_1.getUser)(token);
    if (!user)
        throw new error_helper_1.AppError("Not Authorized", 401);
    const verified_user = await user_model_1.default.findOne({ _id: user.id, verified: true }).lean();
    if (!verified_user)
        throw new error_helper_1.AppError("Not Authorized", 401);
    verified_user.password = "HIDDEN";
    req.user = verified_user;
    next();
};
exports.default = authcheck;
