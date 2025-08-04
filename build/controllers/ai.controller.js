"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAICaption = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const error_helper_1 = require("../helpers/error.helper");
const gemini_helper_1 = require("../helpers/gemini.helper");
exports.getAICaption = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.file)
        throw new error_helper_1.AppError("Give Image to create Caption", 400);
    const { prompt } = req.body;
    console.log(req.file);
    const response = await (0, gemini_helper_1.analyzeImageGoogle)(req.file, prompt || "Keep it eye catching");
    console.log(response);
    res.json({ status: true, message: "Caption Generated", data: response });
});
