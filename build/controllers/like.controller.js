"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const like_model_1 = __importDefault(require("../models/like.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const error_helper_1 = require("../helpers/error.helper");
exports.likePost = (0, express_async_handler_1.default)(async (req, res) => {
    const { post_id } = req.params;
    const user_id = req.user._id;
    const post = await post_model_1.default.findOne({ _id: post_id, type: "posted" });
    if (!post)
        throw new error_helper_1.AppError("Post not found", 404);
    const existingLike = await like_model_1.default.findOne({ post_id, user_id });
    if (existingLike) {
        await like_model_1.default.deleteOne({ _id: existingLike._id });
        res.json({ status: true, message: "Unliked the post", data: false });
    }
    else {
        await like_model_1.default.create({ post_id, user_id });
        res.json({ status: true, message: "Liked the post", data: true });
    }
});
