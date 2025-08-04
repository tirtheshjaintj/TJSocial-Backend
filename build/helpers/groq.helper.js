"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const groqApiKey = process.env.GROQ_API_KEY;
const groq = new groq_sdk_1.default({ apiKey: groqApiKey });
async function getGroqData(prompt) {
    try {
        const result = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
        });
        return result.choices[0]?.message?.content || "";
    }
    catch (error) {
        console.error('Error calling Groq AI API:', error);
        throw new Error("Groq AI Failed");
    }
}
module.exports = getGroqData;
