import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
// addToCartSchema
export const addToCartSchema = joi.object({
    productId: generalFields.id,
    quantity: generalFields.quantity
}).required();

// removeFromCartSchema
export const removeFromCartSchema = joi.object({
    productId: generalFields.id,
}).required();
// updateCartQuantity
export const updateCartQuantity = joi.object({
    productId: generalFields.id,
    quantity: generalFields.quantity
}).required();
// applyCoupon
export const applyCoupon = joi.object({
    code: joi.string().min(3).required()
}).required();
// clearCartSchema
// export const clearCartSchema = joi.object({
//     id: generalFields.id
// }).required()
