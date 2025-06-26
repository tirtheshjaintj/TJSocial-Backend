import { AppError } from "../helpers/error.helper";
import { getUser } from "../helpers/jwt.helper";
import UserModel from "../models/user.model";

const authcheck = async (req: any, res: any, next: Function) => {
    const { authorization } = req.headers;
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.substring(7);
    }
    if (!token) throw new AppError("Not Authorized", 401);
    const user = getUser(token);
    if (!user) throw new AppError("Not Authorized", 401);
    const verified_user = await UserModel.findById(user.id);
    if (!verified_user) throw new AppError("Not Authorized", 401);
    req.user = verified_user;
    next();
}

export default authcheck;