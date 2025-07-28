import { ErrorRequestHandler } from "express";

export class AppError extends Error {
    status_code: number;
    constructor(message: string, status_code: number = 500) {
        super(message);
        this.status_code = status_code;
        Error.captureStackTrace(this, this.constructor);
    }
}
// Error handler at the end
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const status = err.status_code || 500;
    console.log(err);
    // console.error(status, err); // log the full error
    res.status(status).json({
        status: false,
        message: err.message || "Internal Server Error"
    });
};


