import * as authController from "./Controller/auth.controller.js"
import { Router } from "express";
import { auth, authorization, roles } from "../../Middleware/auth.js"
import { validation } from "../../Middleware/validation.js";
import * as validators from "./auth.validation.js"
const router = Router();

// Signup Route
router.post("/signup", validation(validators.signupSchema), authController.signup)
// Confirm Email Route
router.get("/confirmEmail/:token", validation(validators.confirmEmailSchema), authController.confirmEmail)
// New Confirm Email Route
router.get("/confirmEmail/new/:token", validation(validators.confirmEmailSchema), authController.newConfirmEmail)
// Signin Route
router.post("/signin", validation(validators.signinSchema), authController.signin)
// Forget Password 
router.post('/password/forget', validation(validators.forgetPasswordSchema), authController.forgetPassword)
// OTP Password 
router.post('/password/otp', validation(validators.verifyOTPSchema), authController.verifyOTP)
// Get All Users
router.get('/users', auth, authorization(roles.Admin), authController.getUsers)
// Delete User
router.delete('/users', auth, authorization(roles.Admin), validation(validators.deleteUserSchema), authController.deleteUser)
// Add User
router.post("/users", auth, authorization(roles.Admin), validation(validators.createUserSchema), authController.createUser);
// SetAdmin Method
router.put('/setAdmin/:id', auth, authorization(roles.Admin), validation(validators.setAdminSchema), authController.setAdmin)
// Logout Method
router.get('/logout', auth, authController.logout)
export default router;