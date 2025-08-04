"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.setUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "";
const expiresIn = process.env.TOKEN_EXPIRATION || "1h";
const setUser = (user) => {
    //@ts-ignore
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, options); // payload is an object
};
exports.setUser = setUser;
const getUser = (token) => {
    if (!token)
        return null;
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.getUser = getUser;
