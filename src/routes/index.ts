import { Router } from "express";
import userRouter from "./user.route";
import postRouter from "./post.route";
import likeRouter from "./like.route";
import commentRouter from "./comment.route";
import followRouter from "./follow.route";
import aiRouter from "./ai.route";
import bookmarkRouter from "./bookmark.route";
const parentRouter = Router();

parentRouter.get("/", (req, res) => {
    res.status(200).send({
        status: true,
        messsage: "Working Fine"
    });
});

parentRouter.use("/user", userRouter);
parentRouter.use("/post", postRouter);
parentRouter.use("/like", likeRouter);
parentRouter.use("/comment", commentRouter);
parentRouter.use("/follow", followRouter);
parentRouter.use("/ai", aiRouter);
parentRouter.use("/bookmark", bookmarkRouter);


export default parentRouter;

