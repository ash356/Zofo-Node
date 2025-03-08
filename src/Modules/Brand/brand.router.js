import { Router } from "express";
import * as brandController from "./Controller/brand.controller.js"
// import { fileValidation, uploadFile } from "../../Utils/multer.js";
import { fileUploadCloudinary, fileValidationCloudinary } from "../../Utils/multerCloudinary.js";
import * as validators from "./brand.validation.js"
import { auth, authorization, roles } from "../../Middleware/auth.js";
import { validation } from "../../Middleware/validation.js";
const router = Router();

// Add Brand
// router.post("/", uploadFile('brand', auth, authorization(roles.Admin), fileValidation.image).single('image'), brandController.createBrand);
// Cloudinary Upload
router.post("/", auth, authorization(roles.Admin),
    fileUploadCloudinary(fileValidationCloudinary.image).single('image'),
    validation(validators.createBrandSchema),
    brandController.createBrand);
// getAllBrands
router.get("/", brandController.getAllBrands)
// Get Brand
router.get("/:id", validation(validators.getBrandSchema), brandController.getBrand)
// Update Brand
router.patch("/:id", auth, authorization(roles.Admin),
    fileUploadCloudinary(fileValidationCloudinary.image).single('image'), validation(validators.updateBrandSchema), brandController.updateBrand)
// Delete Brand
router.delete("/:id", auth, authorization(roles.Admin), validation(validators.deleteBrandSchema), brandController.deleteBrand)

export default router