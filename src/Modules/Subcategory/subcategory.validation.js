import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
// 
export const createSubcategory = joi.object({
    name: joi.string().min(3).max(33).required(),
    file: generalFields.file.required(),
    categoryId: generalFields.id
})
// 
export const getSubcategory = joi.object({
    id: generalFields.id,
    categoryId: generalFields.id

})
// 
export const updateSubcategory = joi.object({
    name: joi.string().min(3).max(33).required(),
    file: generalFields.file,
    id: generalFields.id,
    categoryId: generalFields.id
})
// 
export const deleteSubcategory = joi.object({
    id: generalFields.id
})

