import multer from "multer";
// Path & dirname
import path from "path"
import { fileURLToPath } from "url"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// File System
import fs from "fs"
import { nanoid } from "nanoid";
// File Validation Object
export const fileValidation = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    file: ['application/pdf', 'application/msword'],
    video: ["video/mp4"],
}
// File Upload
export const uploadFile = (customPath = "general", customValidation = []) => {
    const fullPath = path.join(__dirname, `../uploads/${customPath}`)
    // Check File Exist
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
    }
    // Storage Method
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fullPath)
        },
        filename: (req, file, cb) => {
            const suffixName = nanoid() + "-" + file.originalname
            file.dest = `uploads/${customPath}/${suffixName}`
            cb(null, suffixName)
        }
    });
    const fileFilter = (req, file, cb) => {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("In-Valid File", { cause: 400 }), false);
        }
    };
    const limits = { fileSize: 5000000 }; // Size 5 MB
    const upload = multer({ fileFilter, storage, limits });
    return upload;
};