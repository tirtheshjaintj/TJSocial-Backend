import { validationResult } from "express-validator";
import { AppError } from "../helpers/error.helper";
import expressAsyncHandler from "express-async-handler";

const validate = (req: any, res: any, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        throw new AppError(errors.array()[0].msg, 400);
    }
    next();
};

export default validate;