import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
// 
export const getUser = joi.object({
    id: generalFields.id,
})
// 
export const updateUser = joi.object({
    firstName: joi.string().alphanum().min(3).max(11),
    lastName: joi.string().alphanum().min(3).max(11),
    phone: generalFields.phone,
    gender: joi.string().valid('male', 'female'),
    age: joi.number().min(14).integer()

})
// 
export const changePassword = joi.object({
    oldPassword: generalFields.password,
    newPassword: generalFields.password
})
export const profilePic = joi.object({
    file: generalFields.file.required(),
})
export const coverPic = joi.object({
    file: generalFields.file.required(),
})


