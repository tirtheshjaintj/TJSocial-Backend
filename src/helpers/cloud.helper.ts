import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloud = (fileBuffer: Buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'posts' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result?.secure_url);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

export default uploadToCloud;