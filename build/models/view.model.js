"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ViewSchema = new mongoose_1.Schema({
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
ViewSchema.index({ user_id: 1, post_id: 1 }, {
    unique: true
});
const ViewModel = (0, mongoose_1.model)("View", ViewSchema);
exports.default = ViewModel;
