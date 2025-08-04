import { Router } from "express";
import { createPost, deleteImage, deletePost, getAllPosts, getMyPosts, getPost, getUserPost, updatePost } from "../controllers/post.controller";
import { body, param, query } from "express-validator";
import validate from "../middlewares/validate";
import authcheck from "../middlewares/authcheck";
import upload from "../middlewares/multer";

const postRouter = Router();

postRouter.get("/"
    , query("page").isInt()
    , validate
    ,authcheck
    , getAllPosts);

postRouter.get("/mine"
    , authcheck
    , getMyPosts);


postRouter.get("/:post_id"
    , param("post_id").isMongoId().withMessage("Not Valid MongoID")
    , validate
    , getPost);


postRouter.get("/user/:user_id"
    , param("user_id").isMongoId().withMessage("Not Valid MongoID")
    , validate
    , authcheck
    , getUserPost);

postRouter.delete("/:post_id"
    , param("post_id").isMongoId().withMessage("Not Valid MongoID")
    , validate
    , authcheck
    , deletePost);

postRouter.delete("/image/:image_id"
    , param("image_id").isMongoId().withMessage("Not Valid MongoID")
    , authcheck
    , deleteImage
);

postRouter.post("/", upload.array("images", 10)
    ,[
        body("type").isIn(["draft", "posted"]).withMessage("Can Only be posted or draft")
        , body("post_type").isIn(["post", "story"]).withMessage("Can Only be post or story")
        , body("hashtags")
            .custom((value) => {
                let parsed;
                try {
                    parsed = JSON.parse(value);
                } catch (e) {
                    throw new Error("Hashtags must be a valid JSON array");
                }
                if (!Array.isArray(parsed)) {
                    throw new Error("Hashtags must be an array");
                }
                if (parsed.length < 1) {
                    throw new Error("Hashtags array must contain at least one element");
                }
                return true;
            })
    ]
    , validate
    , authcheck
    , createPost);


postRouter.patch("/:post_id", upload.array("images", 10)
    , [
        param("post_id").isMongoId().withMessage("Not Valid Post ID")
        , body("type").isIn(["draft", "posted"]).withMessage("Can Only be posted or draft")
        , body("post_type").isIn(["post", "story"]).withMessage("Can Only be post or story")
        , body("hashtags")
            .custom((value) => {
                let parsed;
                try {
                    parsed = JSON.parse(value);
                } catch (e) {
                    throw new Error("Hashtags must be a valid JSON array");
                }
                if (!Array.isArray(parsed)) {
                    throw new Error("Hashtags must be an array");
                }
                if (parsed.length < 1) {
                    throw new Error("Hashtags array must contain at least one element");
                }
                return true;
            })
    ]
    , validate
    , authcheck
    , updatePost);

export default postRouter;