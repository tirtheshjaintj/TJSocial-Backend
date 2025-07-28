import expressAsyncHandler from "express-async-handler";
import likeModel from "../models/like.model";
import postModel from "../models/post.model";
import { Response } from "express";
import { AppError } from "../helpers/error.helper";

export const likePost = expressAsyncHandler(async (req: any, res: Response) => {
    const { post_id } = req.params;
    const user_id = req.user._id;
    const post = await postModel.findOne({ _id: post_id, type: "posted" });
    if (!post) throw new AppError("Post not found", 404);
    const existingLike = await likeModel.findOne({ post_id, user_id });
    if (existingLike) {
        await likeModel.deleteOne({ _id: existingLike._id });
        res.json({ status: true, message: "Unliked the post", data: false });
    } else {
        await likeModel.create({ post_id, user_id });
        res.json({ status: true, message: "Liked the post", data: true });
    }
});

