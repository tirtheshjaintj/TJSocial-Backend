"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeImageToBase64 = encodeImageToBase64;
exports.analyzeImageGoogle = analyzeImageGoogle;
const generative_ai_1 = require("@google/generative-ai");
// Utility: Convert Buffer to Base64
function encodeImageToBase64(buffer) {
    return buffer.toString("base64");
}
// Analyze image with Gemini AI to generate a caption
function analyzeImageGoogle(file, prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(file);
        const { mimetype, buffer } = file;
        const base64Image = encodeImageToBase64(buffer);
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("🔍 Analyzing image with Gemini API...");
        try {
            const result = yield model.generateContent([
                `Generate long keyword and formal and professional and engaging and poetic caption for social media post, eye catching (aesthetic) only give one no options give direct caption to be used nothing more in content`,
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: mimetype,
                    },
                },
            ]);
            const response = result.response;
            const text = response.text().replace(/[^a-zA-Z0-9 ]/g, '').trim();
            console.log("✅ AI Response:", text);
            return text;
        }
        catch (error) {
            console.error("❌ Gemini API Error:", (error === null || error === void 0 ? void 0 : error.message) || error);
            throw new Error("Failed to analyze image.");
        }
    });
}
