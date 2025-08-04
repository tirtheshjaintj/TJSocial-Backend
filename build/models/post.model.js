"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
        set: (value) => value.trim(),
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    hashtags: {
        type: [String],
        required: true,
        validate: {
            validator: function (val) {
                return Array.isArray(val) && val.length > 0;
            },
            message: "At least one hashtag is required",
        },
    },
    images: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Image",
        required: true,
        validate: {
            validator: function (val) {
                return Array.isArray(val) && val.length > 0;
            },
            message: "At least one image is required",
        },
    },
    type: {
        type: String,
        enum: ["draft", "posted"],
        default: "posted",
    },
    post_type: {
        type: String,
        enum: ["post", "story"],
        default: "post"
    }
}, { timestamps: true });
postSchema.index({ user_id: 1 });
const postModel = (0, mongoose_1.model)('Post', postSchema);
exports.default = postModel;
