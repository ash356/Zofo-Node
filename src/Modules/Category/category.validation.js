import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
// 
export const createCategory = joi.object({
    name: joi.string().min(3).max(33).required(),
    file: generalFields.file.required()
})
// 
export const getCategory = joi.object({
    id: generalFields.id
})
// 
export const updateCategory = joi.object({
    name: joi.string().min(3).max(33).required(),
    file: generalFields.file.required(),
    id: generalFields.id
})
// 
export const deleteCategory = joi.object({
    id: generalFields.id
})

