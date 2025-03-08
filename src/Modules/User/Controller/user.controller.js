import { asyncHandler } from "../../../Utils/errorHandling.js";
import * as entityService from "../../../Services/entityService.js";
import userModel from "../user.model.js";
import { compare, hash } from "../../../Utils/hashAndCompare.js";
import cloudinary from "../../../Utils/cloudinary.js";
// entityName Var
const entityName = 'User'
// Get All users
export const getAllUsers = entityService.getAllEntities(userModel, entityName)
// Get user By Id
export const getUser = entityService.findEntity(userModel, entityName)
// Update user
export const updateUser = asyncHandler(async (req, res, next) => {
    const checkUser = await userModel.findById(req.user._id)
    if (!checkUser) {
        return next(new Error('User Not Found !', { cause: 404 }));
    }
    const firstName = req.body.firstName || checkUser.firstName;
    const lastName = req.body.lastName || checkUser.lastName;
    if (firstName || lastName) {
        req.body.userName = `${firstName} ${lastName}`
    }
    // Query
    const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
    // Check if User Exist 
    return res.status(200).json({ message: "User Updated", user });
})
// Change Password
export const changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    if (!req.user || !req.user._id) {
        return next(new Error("Unauthorized Access!", { cause: 403 }));
    }
    const user = await userModel.findById(req.user._id);
    if (!user) {
        return next(new Error("User Not Found!", { cause: 404 }));
    }
    // Check Old Password
    if (!compare({ plainText: oldPassword, hashedValue: user.password })) {
        return next(new Error("In-Valid Old Password !", { cause: 400 }));
    }
    // Compare Old With New
    else if (newPassword === oldPassword) {
        return next(
            new Error("Can't Be The Same As Old Password !", { cause: 400 })
        );
    }
    // Update
    else {
        // Hashing Password
        const hashPassword = hash({ plainText: newPassword });
        const updatedUser = await userModel.updateOne(
            { _id: req.user._id },
            {
                $set: {
                    password: hashPassword,
                    passwordChangedAt: Date.now(),
                }
            })
        // Sending Email
        const info = await sendEmail({
            to: updatedUser.email,
            subject: "Password Changed",
            html: verifyOTPTemplate(updatedUser.userName),
        });
        if (!info) {
            return next(new Error("Rejected Email"), { cause: 400 });
        }
        return res.status(200).json({ message: "Done" });
    }
});
// Delete user
export const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndDelete(req.user._id)
    // Check user
    if (!user) {
        return next(new Error(`User Not Found !`, { cause: 404 }))
    }
    // Success
    return res.status(200).json({ message: `User Deleted`, user })
})
// Get User Profile
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel
        .findById(req.user._id)
        .select("firstName lastName email status phone gender profilePic role");
    // Check if User Exist 
    if (!user) {
        return next(new Error('User Not Found !', { cause: 404 }));
    }
    await res.set("Cache-Control", "no-cache");
    return res.status(200).json({ message: "Done", user });
})
// Profile Picture
export const profilePic = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: `${process.env.APP_NAME}/users/${req.user._id}`,
        }
    );
    // If You Need To Delete Last Image
    // await cloudinary.uploader.destroy(user.profilePic.public_id);
    user.profilePic = { secure_url, public_id };
    await user.save();
    return res.status(202).json({ message: "Done", profilePic: user.profilePic });
});
// Cover Picture
export const coverPic = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: `${process.env.APP_NAME}/users/${req.user._id}`,
        }
    );
    // If You Need To Delete Last Image
    // await cloudinary.uploader.destroy(user.profilePic.public_id);
    user.coverPic = { secure_url, public_id };
    await user.save();
    return res.status(202).json({ message: "Done", coverPic: user.coverPic });
});
