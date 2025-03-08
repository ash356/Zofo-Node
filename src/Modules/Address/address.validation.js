import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";

export const addToAddress = joi.object({
    name: joi.string().min(3).required(),
    phone: generalFields.phone,
    street: joi.string().min(3).required(),
    city: joi.string().min(3).required()
})


export const removeFromAddress = joi.object({ addressId: generalFields.id })