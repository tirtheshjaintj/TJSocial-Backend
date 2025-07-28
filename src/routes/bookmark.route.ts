import { Router } from "express";
import { param } from "express-validator";
import validate from "../middlewares/validate";
import authcheck from "../middlewares/authcheck";
import { bookmarkPost } from "../controllers/bookmark.controller";

const bookmarkRouter = Router();

bookmarkRouter.post("/:post_id"
    , param("post_id").isMongoId().withMessage("Is Valid Post ID")
    , validate
    , authcheck
    , bookmarkPost);

export default bookmarkRouter;