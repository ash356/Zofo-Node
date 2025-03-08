import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
export const signupSchema = joi.object({
    firstName: generalFields.userName,
    lastName: generalFields.userName,
    email: generalFields.email,
    password: generalFields.password,
    cpassword: generalFields.cPassword.valid(joi.ref('password'))
}).required()
export const confirmEmailSchema = joi.object({ token: joi.string().required() }).required()

export const newConfirmEmail = joi.object({
    name: joi.string().min(3).required(),
    phone: generalFields.phone,
    street: joi.string().min(3).required(),
    city: joi.string().min(3).required()
})
export const signinSchema = joi.object({
    email: generalFields.email,
    password: generalFields.password
}).required()
export const forgetPasswordSchema = joi.object({ email: generalFields.email }).required()
export const verifyOTPSchema = joi.object({
    email: generalFields.email,
    otpCode: joi.string().min(6).max(6).required(),
    newPassword: generalFields.password,
})
export const deleteUserSchema = joi.object({ id: generalFields.id })
export const createUserSchema = joi.object({
    firstName: generalFields.userName,
    lastName: generalFields.userName,
    email: generalFields.email,
    password: generalFields.password,
    role: joi.string().valid('Admin', 'User').required()
}).required()
export const setAdminSchema = joi.object({ id: generalFields.id })