"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const follow_model_1 = __importDefault(require("../models/follow.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const error_helper_1 = require("../helpers/error.helper");
const mongoose_1 = __importDefault(require("mongoose"));
exports.followUser = (0, express_async_handler_1.default)(async (req, res) => {
    const user_id = req.user._id;
    const follow_id = new mongoose_1.default.Types.ObjectId(req.params.follow_id);
    if (follow_id.equals(user_id))
        throw new error_helper_1.AppError("You cannot follow Yourself", 400);
    const follow_user = await user_model_1.default.findOne({ _id: follow_id, verified: true });
    if (!follow_user)
        throw new error_helper_1.AppError("User Not Found", 404);
    const following = await follow_model_1.default.findOne({ user_id, follow_id });
    if (following) {
        await follow_model_1.default.deleteOne({ user_id, follow_id });
        res.json({ status: true, message: "Unfollowed", data: false });
    }
    else {
        await follow_model_1.default.create({ user_id, follow_id });
        res.json({ status: true, message: "Followed", data: true });
    }
});
