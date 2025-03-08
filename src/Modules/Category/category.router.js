import { Router } from "express";
import * as categoryController from "./Controller/category.controller.js"
import subcategoryRouter from "../Subcategory/subcategory.router.js"
import { auth, authorization, roles } from "../../Middleware/auth.js";
import { validation } from "../../Middleware/validation.js";
import * as validators from "./category.validation.js"
import { fileUploadCloudinary, fileValidationCloudinary } from "../../Utils/multerCloudinary.js";
const router = Router();
// 
router.use("/:categoryId/subcategories", subcategoryRouter)
// Add Category
router.post("/", auth, authorization([roles.Admin]),
    fileUploadCloudinary(fileValidationCloudinary.image).single('image'),
    validation(validators.createCategory),
    categoryController.createCategory);
// Get All Categories
router.get("/", categoryController.getAllCategories);
// Get Category
router.get("/:id", validation(validators.getCategory), categoryController.getCategory)
// Update Category
router.patch("/:id", fileUploadCloudinary(fileValidationCloudinary.image).single('image'),
    validation(validators.updateCategory),
    categoryController.updateCategory)
// Delete Category
router.delete("/:id", auth, authorization([roles.Admin]), validation(validators.deleteCategory), categoryController.deleteCategory)
// InserMany Categories
router.post("/insertMany", categoryController.inserManyCategories)
export default router;