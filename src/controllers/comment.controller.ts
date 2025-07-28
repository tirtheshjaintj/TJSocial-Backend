import { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import postModel from "../models/post.model";
import commentModel from "../models/comment.model";
import { AppError } from "../helpers/error.helper";

export const createComment = expressAsyncHandler(async (req: any, res: Response) => {
    const { post_id } = req.params;
    const { comment } = req.body;
    const user_id = req.user._id;

    const post = await postModel.findOne({ _id: post_id, type: "posted" });
    if (!post) throw new AppError("Post not found", 404);

    const newComment = await commentModel.create({
        user_id,
        post_id,
        comment,
    });

    res.status(201).json({ success: true, message: "Comment Created", data: newComment });
});

export const updateComment = expressAsyncHandler(async (req: any, res: Response) => {
    const { comment_id } = req.params;
    const { comment } = req.body;
    const user_id = req.user._id;

    const existing = await commentModel.findOne({ _id: comment_id, user_id });
    if (!existing) throw new AppError("Comment not found or unauthorized", 404);

    existing.comment = comment;
    await existing.save();

    res.status(200).json({ success: true, message: "Comment Updated", data: existing });
});

export const deleteComment = expressAsyncHandler(async (req: any, res: Response) => {
    const { comment_id } = req.params;
    const user_id = req.user._id;

    const existing = await commentModel.findOne({ _id: comment_id, user_id });
    if (!existing) throw new AppError("Comment not found or unauthorized", 404);

    await commentModel.deleteOne({ _id: comment_id });

    res.status(200).json({ success: true, message: "Comment deleted" });
});

