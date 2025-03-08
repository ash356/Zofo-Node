import { Router } from "express";
import * as productController from "./Controller/product.controller.js"
import { auth, authorization, roles } from "../../Middleware/auth.js";
import { fileUploadCloudinary, fileValidationCloudinary } from "../../Utils/multerCloudinary.js";
import { validation } from "../../Middleware/validation.js";
import * as validators from "./product.validation.js"
const router = Router();
// Add product
router.post("/", auth, authorization(roles.Admin),
    fileUploadCloudinary(fileValidationCloudinary.image).fields([
        { name: 'coverPic', maxCount: 1 },
        { name: 'productImages', maxCount: 10 }]),
    validation(validators.createProduct),
    productController.createProduct);
// getAllproducts
router.get("/", productController.getAllProducts)
// Get product
router.get("/:id", validation(validators.getProduct),
    productController.getProduct)
// Update product
router.patch("/:id", auth, authorization(roles.Admin),
    fileUploadCloudinary(fileValidationCloudinary.image).fields([
        { name: 'coverPic', maxCount: 1 },
        { name: 'productImages', maxCount: 10 }]),
    validation(validators.updateProduct),
    productController.updateProduct)
// Delete product
router.delete("/:id", auth, authorization(roles.Admin),
    validation(validators.deleteProduct),
    productController.deleteProduct)
// InserMany products
router.post("/insertMany", productController.insertManyProducts)
export default router