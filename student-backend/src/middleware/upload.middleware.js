const multer     = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Use memory storage — file goes to RAM first, then we stream to Cloudinary
const storage = multer.memoryStorage();

const videoUpload    = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } }); // 500MB
const materialUpload = multer({ storage, limits: { fileSize: 50  * 1024 * 1024 } }); // 50MB

// ── Helper: upload buffer to Cloudinary ──────────────────────
const uploadToCloudinary = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

module.exports = { videoUpload, materialUpload, uploadToCloudinary };