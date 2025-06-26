import { validationResult } from "express-validator";
import { AppError } from "../helpers/error.helper";

const validate = (req: any, res: any, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
    }
    next();
}

export default validate;