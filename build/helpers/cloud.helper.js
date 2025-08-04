"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloud = void 0;
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
// Cloudinary Config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
/**
 * Delete an image from Cloudinary using its public_id
 */
const deleteFromCloud = (public_id) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.destroy(public_id, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
    });
};
exports.deleteFromCloud = deleteFromCloud;
/**
 * Upload a file buffer to Cloudinary under the 'posts' folder
 */
const uploadToCloud = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: "posts",
            resource_type: "image", // you can also use "auto" if it's not always an image
        }, (error, result) => {
            console.log(process.env.CLOUDINARY_CLOUD_NAME);
            console.log(error);
            if (error)
                return reject(error);
            if (result === null || result === void 0 ? void 0 : result.secure_url) {
                resolve(result.secure_url);
            }
            else {
                reject("No secure_url returned from Cloudinary.");
            }
        });
        streamifier_1.default.createReadStream(fileBuffer).pipe(uploadStream);
    });
};
exports.default = uploadToCloud;
