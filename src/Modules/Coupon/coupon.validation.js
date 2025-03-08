import joi from "joi";
// createCoupon
export const createCoupon = joi.object({
    code: joi.string().trim().uppercase().min(3).max(20).required(),
    expires: joi.date().greater("now").required(),
    discount: joi.number().min(1).max(100).required()
}).required();

// deleteCoupon
export const deleteCoupon = joi.object({
    code: joi.string().trim().uppercase().min(3).max(20).required(),
}).required();
// getCoupon
export const getCoupon = joi.object({
    code: joi.string().trim().uppercase().min(3).max(20).required(),
}).required();

