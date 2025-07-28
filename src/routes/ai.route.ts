import { Router } from "express";
import upload from "../middlewares/multer";
import authcheck from "../middlewares/authcheck";
import { getAICaption } from "../controllers/ai.controller";
const aiRouter = Router();

aiRouter.post("/caption", upload.single("file"), authcheck, getAICaption);

export default aiRouter;