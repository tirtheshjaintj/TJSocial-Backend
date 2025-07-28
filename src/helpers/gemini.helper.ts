import { GoogleGenerativeAI } from "@google/generative-ai";

// Utility: Convert Buffer to Base64
export function encodeImageToBase64(buffer: Buffer): string {
    return buffer.toString("base64");
}

// Analyze image with Gemini AI to generate a caption
export async function analyzeImageGoogle(file: any, prompt: string): Promise<string> {
    console.log(file);
    const { mimetype, buffer } = file;

    const base64Image = encodeImageToBase64(buffer);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("🔍 Analyzing image with Gemini API...");

    try {
        const result = await model.generateContent([
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
    } catch (error: any) {
        console.error("❌ Gemini API Error:", error?.message || error);
        throw new Error("Failed to analyze image.");
    }
}
