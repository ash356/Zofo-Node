import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
// createBrandSchema
export const createBrandSchema = joi.object({
    name: generalFields.userName,
    file: generalFields.file.required(),
}).required();
// getBrandSchema
export const getBrandSchema = joi.object({ id: generalFields.id })
// updateBrandSchema
export const updateBrandSchema = joi.object({
    id: generalFields.id,
    name: generalFields.userName,
    file: generalFields.file.required(),
}).required();
// deleteBrandSchema
export const deleteBrandSchema = joi.object({
    id: generalFields.id
}).required()
