import expressAsyncHandler from "express-async-handler";
import FollowModel from "../models/follow.model";
import UserModel from "../models/user.model";
import { Response } from "express";
import { AppError } from "../helpers/error.helper";

export const followUser = expressAsyncHandler(async (req: any, res: Response) => {
    const { follow_id } = req.params;
    const user_id = req.user._id;
    if (follow_id == user_id) throw new AppError("You cannot follow Yourself", 400);
    const follow_user = await UserModel.findOne({ _id: user_id, verified: true });
    if (!follow_user) throw new AppError("User Not Found", 404);
    const following = await FollowModel.findOne({ user_id, follow_id });
    if (following) {
        await FollowModel.deleteOne({ user_id, follow_id });
        res.json({ status: true, message: "Unfollowed", data: false });
    } else {
        await FollowModel.create({ user_id, follow_id });
        res.json({ status: true, message: "Unfollowed", data: true });
    }
});