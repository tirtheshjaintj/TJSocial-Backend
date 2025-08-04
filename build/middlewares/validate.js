"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const error_helper_1 = require("../helpers/error.helper");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        throw new error_helper_1.AppError(errors.array()[0].msg, 400);
    }
    next();
};
exports.default = validate;
