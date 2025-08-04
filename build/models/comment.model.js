"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    comment: {
        type: String,
        required: true,
        set: (v) => v.trim()
    }
}, { timestamps: true });
CommentSchema.index({ user_id: 1, post_id: 1 }, {
    unique: true
});
const CommentModel = (0, mongoose_1.model)("Comment", CommentSchema);
exports.default = CommentModel;
