import expressAsyncHandler from "express-async-handler";
import postModel from "../models/post.model";
import { Response } from "express";
import { AppError } from "../helpers/error.helper";
import BookmarkModel from "../models/bookmark.model";

export const bookmarkPost = expressAsyncHandler(async (req: any, res: Response) => {
    const { post_id } = req.params;
    const user_id = req.user._id;
    const post = await postModel.findOne({ _id: post_id, type: "posted" });
    if (!post) throw new AppError("Post not found", 404);
    const existingLike = await BookmarkModel.findOne({ post_id, user_id });
    if (existingLike) {
        await BookmarkModel.deleteOne({ _id: existingLike._id });
        res.json({ status: true, message: "Removed From Bookmarks", data: false });
    } else {
        await BookmarkModel.create({ post_id, user_id });
        res.json({ status: true, message: "Added Bookmark", data: true });
    }
});

