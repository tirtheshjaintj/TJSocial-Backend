"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const express_validator_1 = require("express-validator");
const validate_1 = __importDefault(require("../middlewares/validate"));
const authcheck_1 = __importDefault(require("../middlewares/authcheck"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const postRouter = (0, express_1.Router)();
postRouter.get("/", (0, express_validator_1.query)("page").isInt(), validate_1.default, post_controller_1.getAllPosts);
postRouter.get("/mine", authcheck_1.default, post_controller_1.getMyPosts);
postRouter.get("/:post_id", (0, express_validator_1.param)("post_id").isMongoId().withMessage("Not Valid MongoID"), validate_1.default, post_controller_1.getPost);
postRouter.get("/user/:user_id", (0, express_validator_1.param)("user_id").isMongoId().withMessage("Not Valid MongoID"), validate_1.default, authcheck_1.default, post_controller_1.getUserPost);
postRouter.delete("/:post_id", (0, express_validator_1.param)("post_id").isMongoId().withMessage("Not Valid MongoID"), validate_1.default, authcheck_1.default, post_controller_1.deletePost);
postRouter.delete("/image/:image_id", (0, express_validator_1.param)("post_id").isMongoId().withMessage("Not Valid MongoID"), authcheck_1.default, post_controller_1.deleteImage);
postRouter.post("/", multer_1.default.array("images", 10), (req, res, next) => {
    console.log("Data", req.body);
    next();
}, [
    (0, express_validator_1.body)("type").isIn(["draft", "posted"]).withMessage("Can Only be posted or draft"),
    (0, express_validator_1.body)("post_type").isIn(["post", "story"]).withMessage("Can Only be post or story"),
    (0, express_validator_1.body)("hashtags")
        .custom((value) => {
        let parsed;
        try {
            parsed = JSON.parse(value);
        }
        catch (e) {
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
], validate_1.default, authcheck_1.default, post_controller_1.createPost);
postRouter.patch("/:post_id", multer_1.default.array("images", 10), [
    (0, express_validator_1.param)("post_id").isMongoId().withMessage("Not Valid Post ID"),
    (0, express_validator_1.body)("type").isIn(["draft", "posted"]).withMessage("Can Only be posted or draft"),
    (0, express_validator_1.body)("post_type").isIn(["post", "story"]).withMessage("Can Only be post or story"),
    (0, express_validator_1.body)("hashtags")
        .custom((value) => {
        let parsed;
        try {
            parsed = JSON.parse(value);
        }
        catch (e) {
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
], validate_1.default, authcheck_1.default, post_controller_1.createPost);
exports.default = postRouter;
