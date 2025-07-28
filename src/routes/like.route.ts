import { Router } from "express";
import { param } from "express-validator";
import validate from "../middlewares/validate";
import authcheck from "../middlewares/authcheck";
import { likePost } from "../controllers/like.controller";

const likeRouter = Router();

likeRouter.post("/:post_id"
    , param("post_id").isMongoId().withMessage("Is Valid Post ID")
    , validate
    , authcheck
    , likePost);

export default likeRouter;