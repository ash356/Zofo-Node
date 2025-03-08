import { Router } from "express";
import * as userController from "./Controller/user.controller.js"
import { auth, authorization, roles } from "../../Middleware/auth.js";
import { fileUploadCloudinary, fileValidationCloudinary } from "../../Utils/multerCloudinary.js";
import { validation } from "../../Middleware/validation.js";
import * as validators from "./user.validation.js"
const router = Router();
// get All Users
router.get("/", auth, authorization(roles.Admin), userController.getAllUsers)
// Get user
router.get("/:id", auth, validation(validators.getUser), userController.getUser)
// Update user
router.patch("/", auth, validation(validators.updateUser), userController.updateUser)
// Change Password
router.put("/changePassword", auth, validation(validators.changePassword), userController.changePassword)
// Delete user
router.delete("/", auth, userController.deleteUser)
// Get User Profile
router.post("/profile", auth, userController.getProfile);
// Profile Picture
router.post("/profile/picture", auth, fileUploadCloudinary(fileValidationCloudinary.image).single('image'),
    validation(validators.profilePic),
    userController.profilePic
);
// Cover Picture
router.post("/profile/cover", auth, fileUploadCloudinary(fileValidationCloudinary.image).single('image'),
    validation(validators.coverPic),
    userController.coverPic
);

export default router