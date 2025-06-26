import multer from "multer";
import { Request } from "express";

const storage = multer.memoryStorage();
const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
    } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});

const upload2 = multer({
    storage: storage2,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});

export default upload;
