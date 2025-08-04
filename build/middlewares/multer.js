"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const storage2 = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/tif",
        "image/ico",
        "image/heic",
        "image/heif",
        "image/avif",
        "image/svg+xml",
        "image/eps",
        "application/pdf"
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});
const upload2 = (0, multer_1.default)({
    storage: storage2,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});
exports.default = upload;
