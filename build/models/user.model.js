"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^[a-zA-Z0-9\s]+$/.test(v),
            message: "Not a valid name! Only letters,spaces and numbers are allowed.",
        },
    },
    username: {
        type: String, required: true, unique: true,
        set: (value) => value.trim().toLowerCase(),
        validate: {
            validator: (v) => {
                return /^\S+$/.test(v) && v.trim().length >= 3;
            },
            message: "Username cannot contain spaces or whitespace characters.",
        },
    },
    account_type: {
        type: String,
        enum: ["private", "public"],
        required: true,
        default: "public"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
            message: "Not a valid email!",
        },
    },
    password: { type: String, required: true },
    phone_number: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^[0-9]{10}$/.test(v),
            message: "Not a valid phone number! It must be 10 digits.",
        },
    },
    bio: { type: String, default: "I am TJ Social User" },
    profile_pic: {
        type: String,
        validate: {
            validator: (v) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(v),
            message: "Not a valid URL!",
        },
    },
    cover_pic: {
        type: String,
        validate: {
            validator: (v) => /^(https?:\/\/[^\s$.?#].[^\s]*)$/i.test(v),
            message: "Not a valid URL!",
        },
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => {
                const today = new Date();
                const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
                return value <= thirteenYearsAgo;
            },
            message: "User must be at least 13 years old.",
        },
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    otp: {
        type: String,
        validate: {
            validator: function (val) {
                return !val || (val === null || val === void 0 ? void 0 : val.length) == 6;
            },
            message: "OTP must be 6 digits"
        }
    },
    google_id: {
        type: String,
        validate: {
            validator: function (v) {
                return !v || /^\d{21}$/.test(v);
            },
            message: props => `Not Valid Google ID`
        },
        unique: true,
        sparse: true // Allows multiple `null` values
    }
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield bcrypt_1.default.hash(this.password, 12);
        }
        next();
    });
});
userSchema.methods.isPasswordCorrect = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
