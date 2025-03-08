import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
// 
export const addToWishlist = joi.object({
    productId: generalFields.id
})
// 
export const removeFromWishlist = joi.object({
    productId: generalFields.id
})


