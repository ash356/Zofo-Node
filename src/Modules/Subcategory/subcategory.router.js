import { Router } from "express";
import * as subcategoryController from "./Controller/subcategory.controller.js"
import { auth, authorization, roles } from "../../Middleware/auth.js";
import * as validators from "./subcategory.validation.js"
import { validation } from "../../Middleware/validation.js";
import { fileUploadCloudinary, fileValidationCloudinary } from "../../Utils/multerCloudinary.js";
const router = Router({ mergeParams: true });
// Add Subcategory
router.post("/", auth, authorization(roles.Admin),
    fileUploadCloudinary(fileValidationCloudinary.image).single('image'),
    validation(validators.createSubcategory),
    subcategoryController.createsubcategory
);
// Get All Subategories
router.get("/", subcategoryController.getAllSubcategories);
// Get Subcategory
router.get("/:id", validation(validators.getSubcategory), subcategoryController.getsubcategory)
// Update Subcategory
router.patch("/:id", auth, authorization(roles.Admin),
    fileUploadCloudinary(fileValidationCloudinary.image).single('image'),
    validation(validators.updateSubcategory),
    subcategoryController.updatesubcategory)
// Delete Subcategory
router.delete("/:id", auth, authorization(roles.Admin), validation(validators.deleteSubcategory), subcategoryController.deletesubcategory)
// InserMany SubCategories
router.post("/insertMany", subcategoryController.inserManySubcategories)

export default router;