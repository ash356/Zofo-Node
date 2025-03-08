import { Router } from "express";
import * as wishlistController from "./Controller/wishlist.controller.js"
import { auth, authorization, roles } from "../../Middleware/auth.js";
import { validation } from "../../Middleware/validation.js";
import * as validators from "./wishlist.validation.js"
const router = Router()
// Global Middleware For All Routes
router.use(auth, authorization(roles.User))
// Add Wishlist
router.patch('/', validation(validators.addToWishlist), wishlistController.addToWishlist)
// Delete Wishlist
router.delete('/', validation(validators.addToWishlist), wishlistController.removeFromWishlist)
// Get User Wishlist
router.get('/', wishlistController.getUserWishlist)

export default router