"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const imageSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    post_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post"
    },
    image_url: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(v),
            message: "Not a valid URL!"
        }
    }
}, { timestamps: true });
imageSchema.index({ post_id: 1, user_id: 1 });
const imageModel = (0, mongoose_1.model)("Image", imageSchema);
exports.default = imageModel;
