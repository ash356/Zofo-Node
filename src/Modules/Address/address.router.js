import { Router } from "express";
import * as addressController from "./Controller/address.controller.js"
import { auth, authorization, roles } from "../../Middleware/auth.js";
import * as validators from "./address.validation.js"
import { validation } from "../../Middleware/validation.js";
const router = Router()
// Global Middleware For All Routes
router.use(auth, authorization(roles.User))
// Add Wishlist
router.patch('/', validation(validators.addToAddress), addressController.addToAddress)
// Delete address
router.delete('/', validation(validators.removeFromAddress), addressController.removeFromAddress)
// Get User address
router.get('/', addressController.getUserAddress)

export default router