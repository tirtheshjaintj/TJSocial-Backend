"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_1 = __importDefault(require("../middlewares/validate"));
const authcheck_1 = __importDefault(require("../middlewares/authcheck"));
const like_controller_1 = require("../controllers/like.controller");
const likeRouter = (0, express_1.Router)();
likeRouter.post("/:post_id", (0, express_validator_1.param)("post_id").isMongoId().withMessage("Is Valid Post ID"), validate_1.default, authcheck_1.default, like_controller_1.likePost);
exports.default = likeRouter;
