"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createComment = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const post_model_1 = __importDefault(require("../models/post.model"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const error_helper_1 = require("../helpers/error.helper");
exports.createComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id } = req.params;
    const { comment } = req.body;
    const user_id = req.user._id;
    const post = yield post_model_1.default.findOne({ _id: post_id, type: "posted" });
    if (!post)
        throw new error_helper_1.AppError("Post not found", 404);
    const newComment = yield comment_model_1.default.create({
        user_id,
        post_id,
        comment,
    });
    res.status(201).json({ success: true, message: "Comment Created", data: newComment });
}));
exports.updateComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    const { comment } = req.body;
    const user_id = req.user._id;
    const existing = yield comment_model_1.default.findOne({ _id: comment_id, user_id });
    if (!existing)
        throw new error_helper_1.AppError("Comment not found or unauthorized", 404);
    existing.comment = comment;
    yield existing.save();
    res.status(200).json({ success: true, message: "Comment Updated", data: existing });
}));
exports.deleteComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    const user_id = req.user._id;
    const existing = yield comment_model_1.default.findOne({ _id: comment_id, user_id });
    if (!existing)
        throw new error_helper_1.AppError("Comment not found or unauthorized", 404);
    yield comment_model_1.default.deleteOne({ _id: comment_id });
    res.status(200).json({ success: true, message: "Comment deleted" });
}));
