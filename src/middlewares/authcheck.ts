import { AppError } from "../helpers/error.helper";
import { getUser } from "../helpers/jwt.helper";
import UserModel from "../models/user.model";

const authcheck = async (req: any, res: any, next: Function) => {
    const { authorization } = req.headers;
    let token;
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.substring(7);
    }
    if (req.cookies && req.cookies.user_token) {
        token = req.cookies.user_token;
        console.log(token);
    }
    console.log(req.cookies);
    if (!token) throw new AppError("Not Authorized", 401);
    const user = getUser(token);
    if (!user) throw new AppError("Not Authorized", 401);
    const verified_user = await UserModel.findOne({ _id: user.id, verified: true }).lean();
    if (!verified_user) throw new AppError("Not Authorized", 401);
    verified_user.password = "HIDDEN";
    req.user = verified_user;
    next();
}

export default authcheck;