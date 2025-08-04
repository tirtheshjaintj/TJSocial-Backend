"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_1 = __importDefault(require("../middlewares/validate"));
const authcheck_1 = __importDefault(require("../middlewares/authcheck"));
const comment_controller_1 = require("../controllers/comment.controller");
const commentRouter = (0, express_1.Router)();
commentRouter.post("/:post_id", [
    (0, express_validator_1.param)("post_id").isMongoId().withMessage("Not Valid Post ID"),
    (0, express_validator_1.body)("comment").isLength({ min: 5 }).withMessage("Comment Must be atleast 5 characters")
], validate_1.default, authcheck_1.default, comment_controller_1.createComment);
commentRouter.patch("/:comment_id", [
    (0, express_validator_1.param)("comment_id").isMongoId().withMessage("Not Valid Comment ID"),
    (0, express_validator_1.body)("comment").isLength({ min: 5 }).withMessage("Comment Must be atleast 5 characters")
], validate_1.default, authcheck_1.default, comment_controller_1.updateComment);
commentRouter.delete("/:comment_id", (0, express_validator_1.param)("comment_id").isMongoId().withMessage("Not Valid Comment ID"), validate_1.default, authcheck_1.default, comment_controller_1.deleteComment);
exports.default = commentRouter;
