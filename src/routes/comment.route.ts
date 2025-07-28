import { Router } from "express";
import { body, param } from "express-validator";
import validate from "../middlewares/validate";
import authcheck from "../middlewares/authcheck";
import { createComment, deleteComment, updateComment } from "../controllers/comment.controller";

const commentRouter = Router();

commentRouter.post("/:post_id"
    , [
        param("post_id").isMongoId().withMessage("Not Valid Post ID"),
        body("comment").isLength({ min: 5 }).withMessage("Comment Must be atleast 5 characters")
    ]
    , validate
    , authcheck
    , createComment);

commentRouter.patch("/:comment_id"
    , [
        param("comment_id").isMongoId().withMessage("Not Valid Comment ID"),
        body("comment").isLength({ min: 5 }).withMessage("Comment Must be atleast 5 characters")
    ], validate
    , authcheck
    , updateComment);

commentRouter.delete("/:comment_id"
    , param("comment_id").isMongoId().withMessage("Not Valid Comment ID")
    , validate
    , authcheck
    , deleteComment
);

export default commentRouter;