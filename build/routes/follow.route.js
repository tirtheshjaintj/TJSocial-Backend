"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_1 = __importDefault(require("../middlewares/validate"));
const authcheck_1 = __importDefault(require("../middlewares/authcheck"));
const follow_controller_1 = require("../controllers/follow.controller");
const followRouter = (0, express_1.Router)();
followRouter.post("/:follow_id", (0, express_validator_1.param)("follow_id").isMongoId().withMessage("User ID not Valid"), validate_1.default, authcheck_1.default, follow_controller_1.followUser);
exports.default = followRouter;
