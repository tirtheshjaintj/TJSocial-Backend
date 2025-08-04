"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, { timestamps: true });
likeSchema.index({ user_id: 1, post_id: 1 }, {
    unique: true
});
const likeModel = (0, mongoose_1.model)("Like", likeSchema);
exports.default = likeModel;
