import expressAsyncHandler from "express-async-handler";
import { AppError } from "../helpers/error.helper";
import { analyzeImageGoogle, encodeImageToBase64 } from "../helpers/gemini.helper";


export const getAICaption = expressAsyncHandler(async (req, res) => {
    if (!req.file) throw new AppError("Give Image to create Caption", 400);
    const { prompt } = req.body;
    console.log(req.file);
    const response = await analyzeImageGoogle(req.file, prompt || "Keep it eye catching");
    console.log(response);
    res.json({ status: true, message: "Caption Generated", data: response });
}); 