"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../middlewares/multer"));
const authcheck_1 = __importDefault(require("../middlewares/authcheck"));
const ai_controller_1 = require("../controllers/ai.controller");
const aiRouter = (0, express_1.Router)();
aiRouter.post("/caption", multer_1.default.single("file"), authcheck_1.default, ai_controller_1.getAICaption);
exports.default = aiRouter;
