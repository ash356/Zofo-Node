import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
// 
export const createReview = joi.object({
    title: joi.string().min(3).required(),
    ratingAverage: joi.number().positive().min(1).max(5).required(),
    productId: generalFields.id
})
// 
export const getReview = joi.object({
    id: generalFields.id
})
// 
export const updateReview = joi.object({
    title: joi.string().min(3).required(),
    ratingAverage: joi.number().positive().min(1).max(5).required(),
    id: generalFields.id
})
export const deleteReview = joi.object({
    id: generalFields.id
})

