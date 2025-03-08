import { Router } from "express";
import * as couponController from "./Controller/coupon.controller.js"
import { auth, authorization, roles } from "../../Middleware/auth.js";
import { validation } from "../../Middleware/validation.js";
import * as validators from "./coupon.validation.js"
const router = Router()
// Global Middleware For All Routes
router.use(auth, authorization(roles.Admin))
// Add Coupon
router.patch('/', validation(validators.createCoupon), couponController.createCoupon)
// Delete Coupon
router.delete('/', validation(validators.deleteCoupon), couponController.deleteCoupon)
// Get Coupon
router.get('/', validation(validators.deleteCoupon), couponController.getCoupon)

export default router