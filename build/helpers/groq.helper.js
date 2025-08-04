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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const groqApiKey = process.env.GROQ_API_KEY;
const groq = new groq_sdk_1.default({ apiKey: groqApiKey });
function getGroqData(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const result = yield groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.1-8b-instant",
            });
            return ((_b = (_a = result.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "";
        }
        catch (error) {
            console.error('Error calling Groq AI API:', error);
            throw new Error("Groq AI Failed");
        }
    });
}
module.exports = getGroqData;
