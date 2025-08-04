"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, status_code = 500) {
        super(message);
        this.status_code = status_code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Error handler at the end
const errorHandler = (err, req, res, next) => {
    const status = err.status_code || 500;
    console.log(err);
    // console.error(status, err); // log the full error
    res.status(status).json({
        status: false,
        message: err.message || "Internal Server Error"
    });
};
exports.errorHandler = errorHandler;
