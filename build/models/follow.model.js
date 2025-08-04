"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FollowSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    follow_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });
FollowSchema.index({ user_id: 1, follow_id: 1 }, {
    unique: true
});
const FollowModel = (0, mongoose_1.model)("Follow", FollowSchema);
exports.default = FollowModel;
