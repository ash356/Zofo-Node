import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
// createProduct
export const createProduct = joi.object({
    name: joi.string().min(3).max(100).trim().required(),
    description: joi.string().min(8).trim().required(),
    stock: joi.number().integer().min(0).required(),
    colors: joi.array().items(joi.string().trim()),
    price: joi.number().min(0).required(),
    discount: joi.number().min(0).max(100),
    categoryId: generalFields.id,
    subcategoryId: generalFields.id,
    brandId: generalFields.id,
    averageRating: joi.number().min(1).max(5),
    ratingCount: joi.number().integer().min(0).default(0),
    soldCount: joi.number().integer().min(0),
    file: joi.object({
        coverPic: joi.array().items(generalFields.file).required(),
        productImages: joi.array().items(generalFields.file).optional(),
    }).required(),

})
// getProduct
export const getProduct = joi.object({
    id: generalFields.id
})
//  updateProduct
export const updateProduct = joi.object({
    id: generalFields.id,
    name: joi.string().min(3).max(100).trim(),
    description: joi.string().min(8).trim(),
    stock: joi.number().integer().min(0),
    colors: joi.array().items(joi.string().trim()),
    price: joi.number().min(0),
    discount: joi.number().min(0).max(100),
    averageRating: joi.number().min(1).max(5),
    ratingCount: joi.number().integer().min(0).default(0),
    soldCount: joi.number().integer().min(0),
    file: joi.object({
        coverPic: joi.array().items(generalFields.file),
        productImages: joi.array().items(generalFields.file).optional(),
    }),

})
// deleteProduct
export const deleteProduct = joi.object({
    id: generalFields.id
})