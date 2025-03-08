import multer from "multer";
// File Validation Object
export const fileValidationCloudinary = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    file: ['application/pdf', 'application/msword'],
    video: ["video/mp4"],
}
// File Upload
export const fileUploadCloudinary = (customValidation = []) => {
    // Storage Method
    const storage = multer.diskStorage({})
    // Filteration Method 
    const fileFilter = (req, file, cb) => {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        }
        else {
            cb(new Error('In-Valid File', { cause: 400 }), false)
        }
    }
    // Upload
    const upload = multer({ fileFilter, storage, limits: { fileSize: 10 * 1024 * 1024, files: 12 } })
    return upload;
}
