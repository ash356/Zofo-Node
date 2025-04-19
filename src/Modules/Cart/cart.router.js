import { Router } from "express";
import * as cartController from "./Controller/cart.controller.js"
import { auth, authorization, roles } from "../../Middleware/auth.js";
import { validation } from "../../Middleware/validation.js";
import * as validators from "./cart.validation.js"
const router = Router()
// Global Middleware
router.use(auth, authorization(roles.User))
// Add To Cart
router.post('/', validation(validators.addToCartSchema), cartController.addToCart)
// Remove From Cart
router.delete('/', validation(validators.removeFromCartSchema), cartController.removeFromCart)
// Update Quantity
router.patch('/', validation(validators.updateCartQuantity), cartController.updateCartQuantity)
// Apply Coupon
router.put('/coupon', validation(validators.applyCoupon), cartController.applyCoupon)
// Get User Cart
router.get('/', cartController.getUserCart)
// Clear Cart
router.delete('/clear', cartController.clearCart)


export default router