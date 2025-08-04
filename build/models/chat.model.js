"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    sender_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        set: (v) => v.trim()
    },
    image_url: {
        type: String,
        validate: {
            validator: (v) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(v),
            message: "Not a valid URL!"
        }
    }
}, { timestamps: true });
ChatSchema.index({ user_id: 1, sender_id: 1 });
const ChatModel = (0, mongoose_1.model)("Chat", ChatSchema);
exports.default = ChatModel;
