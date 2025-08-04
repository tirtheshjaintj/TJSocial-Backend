"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("./user.route"));
const post_route_1 = __importDefault(require("./post.route"));
const like_route_1 = __importDefault(require("./like.route"));
const comment_route_1 = __importDefault(require("./comment.route"));
const follow_route_1 = __importDefault(require("./follow.route"));
const ai_route_1 = __importDefault(require("./ai.route"));
const bookmark_route_1 = __importDefault(require("./bookmark.route"));
const parentRouter = (0, express_1.Router)();
parentRouter.get("/", (req, res) => {
    res.status(200).send({
        status: true,
        messsage: "Working Fine"
    });
});
parentRouter.use("/user", user_route_1.default);
parentRouter.use("/post", post_route_1.default);
parentRouter.use("/like", like_route_1.default);
parentRouter.use("/comment", comment_route_1.default);
parentRouter.use("/follow", follow_route_1.default);
parentRouter.use("/ai", ai_route_1.default);
parentRouter.use("/bookmark", bookmark_route_1.default);
exports.default = parentRouter;
