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
exports.bookmarkPost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const post_model_1 = __importDefault(require("../models/post.model"));
const error_helper_1 = require("../helpers/error.helper");
const bookmark_model_1 = __importDefault(require("../models/bookmark.model"));
exports.bookmarkPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id } = req.params;
    const user_id = req.user._id;
    const post = yield post_model_1.default.findOne({ _id: post_id, type: "posted" });
    if (!post)
        throw new error_helper_1.AppError("Post not found", 404);
    const existingLike = yield bookmark_model_1.default.findOne({ post_id, user_id });
    if (existingLike) {
        yield bookmark_model_1.default.deleteOne({ _id: existingLike._id });
        res.json({ status: true, message: "Removed From Bookmarks", data: false });
    }
    else {
        yield bookmark_model_1.default.create({ post_id, user_id });
        res.json({ status: true, message: "Added Bookmark", data: true });
    }
}));
