"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const db = await mongoose_1.default.connect(process.env.MONGODB_URL || "");
        console.log(`MongoDB Connected At ${db.connection.host}`);
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = connectDB;
