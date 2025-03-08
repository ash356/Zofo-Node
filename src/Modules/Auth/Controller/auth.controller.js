import { asyncHandler } from "../../../Utils/errorHandling.js";
import userModel from "../../User/user.model.js";
import { generateToken, verifyToken } from "../../../Utils/generateAndVerifyToken.js";
import sendEmail from "../../../Utils/sendEmail.js"
import { compare, hash } from "../../../Utils/hashAndCompare.js";
import { forgetPasswordTemplate, signupTemplate, verifyOTPTemplate } from "../../../Services/emailTemplate.js";
import { customAlphabet } from "nanoid";
import { roles } from "../../../Middleware/auth.js";

//  Signup Method
export const signup = asyncHandler(
    async (req, res, next) => {
        // Destructing Data From Body Request
        const { firstName, lastName, email, password, cpassword } = req.body;
        // Check cPassword
        if (cpassword !== password) {
            return next(new Error("Password & cPassword Missmatch ❗", { cause: 400 }));
        }
        // Find Query To Check User
        const checkUser = await userModel.findOne({ email: email.toLowerCase() });
        if (checkUser) {
            return next(new Error("Duplicated User ❗", { cause: 409 }));
        }
        // Sending Email To Confirm
        // First Token Valid For 5 Mins
        const token = generateToken({
            payload: { email },
            expiresIn: 60 * 5,
            signature: process.env.EMAIL_TOKEN,
        });
        // Link
        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
        // Refresh Token
        const refreshToken = generateToken({
            payload: { email },
            expiresIn: 60 * 60 * 24 * 30,
            signature: process.env.EMAIL_TOKEN,
        });
        const refreshLink = `${req.protocol}://${req.headers.host}/auth/confirmEmail/new/${refreshToken}`;
        //   Call Sending Method
        const info = await sendEmail({
            to: email,
            subject: "You're Almost There! ✅",
            html: signupTemplate(link, refreshLink),
        });
        if (!info) {
            return next(new Error("Rejected Email ❗", { cause: 400 }));
        }
        // Hashing Password
        const hashPassword = hash({ plainText: password });
        // Create Query
        const user = await userModel.create({ firstName, lastName, userName: `${firstName} ${lastName}`, email, password: hashPassword });
        return res.status(201).json({ message: "Done", user: { userName: user.userName, email: user.email } });
    });
// Confirm Email Method
export const confirmEmail = asyncHandler(
    async (req, res, next) => {
        // destructing
        const { token } = req.params;
        const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });
        // Update Query
        const user = await userModel.updateOne({ email: email.toLowerCase() }, { confirmEmail: true });
        return user.modifiedCount
            ? res.status(200).json({ message: "Success Signin Now" })
            : next(new Error("Not Register Account ❗", { cause: 404 }));
    });
// Confirm New Email Method
export const newConfirmEmail = asyncHandler(
    async (req, res, next) => {
        // destructing
        const { token } = req.params;
        const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN });
        // Sending Email To Confirm
        // First Token Valid For 5 Mins
        const newToken = generateToken({
            payload: { email },
            expiresIn: 60 * 5,
            signature: process.env.EMAIL_TOKEN,
        });
        // Link
        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
        // Old Refresh Token
        const refreshLink = `${req.protocol}://${req.headers.host}/auth/confirmEmail/new/${token}`;
        //   Call Sending Method
        const info = await sendEmail({
            to: email,
            subject: "You're Almost There! ✅",
            html: signupTemplate(link, refreshLink),
        });
        if (!info) {
            return next(new Error("Rejected Email ❗", { cause: 400 }));
        }
        return res.status(200).json({ message: `Success Email Sent To ${email}` });
    });
//  Signin Method
export const signin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });
    // Check User
    if (!user || !compare({ plainText: password, hashedValue: user.password })) {
        return next(new Error("Invalid Email Or Password❗", { cause: 400 }));
    }
    // Check If Confirmed Email
    if (!user.confirmEmail) {
        return next(new Error("Please Confirm Email First❗", { cause: 400 }));
    }
    // Generate Token
    const token = generateToken({
        payload: { id: user._id, name: user.userName, isLoggedIn: true },
        expiresIn: 60 * 60 * 24 * 30  // 30 Days
    });
    // Update Query
    const upUser = await userModel.updateOne({ _id: user._id }, { $set: { status: "Online" } });
    return res.status(200).json({ message: "Done", token });
});
//  forgetpassword
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || !user.confirmEmail) {
        return next(new Error("Email Not Found !", { cause: 404 }));
    } else {
        // Create OTP
        const nanoid = customAlphabet(process.env.ALPHABET, 6);
        const otpCode = nanoid();
        user.otpCode = otpCode;
        await user.save();
        // Sending Email
        const info = await sendEmail({
            to: email,
            subject: "OTP Password",
            html: forgetPasswordTemplate(user.userName, otpCode),
        });
        if (!info) {
            return next(new Error("Rejected Email"), { cause: 400 });
        }
        return res.status(201).json({ message: "Success", user: user.email });
    }
});
//  Verify OTP Password
export const verifyOTP = asyncHandler(async (req, res, next) => {
    const { email, otpCode, newPassword } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
        return next(new Error("Invalid Email"), { cause: 400 });
    }
    if (user.otpCode != otpCode || !otpCode) {
        return next(new Error("Invalid OTP Code"), { cause: 400 });
    }
    // If Change Password As Old Password
    else if (compare({ plainText: newPassword, hashedValue: user.password })) {
        return next(
            new Error("Can't Reset Password Like Old Password", { cause: 400 })
        );
    }
    // Valid Email , Code , NewPassword
    else {
        // Hashing Password
        const hashPassword = hash({ plainText: newPassword });
        // Update Query
        await userModel.findOneAndUpdate({ _id: user._id }, { $set: { password: hashPassword, otpCode: null } });
        // Sending Email
        const info = await sendEmail({
            to: email,
            subject: "Reset Password Success",
            html: verifyOTPTemplate(user.userName),
        });
        if (!info) {
            return next(new Error("Rejected Email"), { cause: 400 });
        }
        return res.status(200).json({ message: "Done" });
    }
});
//  Get All Users
export const getUsers = asyncHandler(async (req, res, next) => {
    const users = await userModel
        .find({ _id: { $ne: req.user._id } })
        .select("firstName lastName email status phone gender role confirmEmail");
    // Check User
    if (!users) {
        return next(new Error("Users Not Found !", { cause: 404 }));
    }
    return res.status(200).json({ message: "Done", users });
});
//  Delete User
export const deleteUser = asyncHandler(async (req, res, next) => {
    // Destructing id from body
    const { id } = req.body;
    const user = await userModel.findByIdAndDelete(id);
    // Check User
    if (!user) {
        return next(new Error("Account Not Found !", { cause: 404 }));
    }
    return res.status(200).json({ message: "Done", user: user._id });
});
// Logout Method
export const logout = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    // Check User
    if (!user) {
        return next(new Error("Account Not Found !", { cause: 404 }));
    }
    user.status = "Offline";
    await user.save();
    return res.status(200).json({ message: "Done", status: user.status });
});
// Create User
export const createUser = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;
    if (req.user.role !== 'Admin') {
        return next(new Error('Access Denied! Admins Only ❗', { cause: 403 }));
    }
    // Check if user already exists
    const isUser = await userModel.findOne({ email: email.toLowerCase() });
    if (isUser) {
        return next(new Error('Duplicated User ❗', { cause: 409 }));
    }
    const validRoles = Object.values(roles); // Object to Array
    if (!validRoles.includes(role)) {
        return next(new Error("Invalid Role ❗", { cause: 400 }));
    }
    // Confirm Eamil
    const confirmEmail = true;
    // Hashing Password
    const hashPassword = hash({ plainText: password });
    // Create the user
    const user = await userModel.create({ firstName, lastName, userName: `${firstName} ${lastName}`, email, password: hashPassword, role, confirmEmail });
    return res.status(201).json({
        message: "User Added Successfully ✅",
        user: { id: user._id, userName: user.userName, email: user.email, role: user.role }
    });
});
//  Set Admin
export const setAdmin = asyncHandler(async (req, res, next) => {
    // Destructing id From Params
    const { id } = req.params;
    const admin = await userModel.findById(req.user._id);
    if (admin.role != "Admin") {
        return next(new Error("Not Allowed To Change Roles"), { cause: 400 });
    }
    const user = await userModel.findById(id);
    // Check User
    if (!user) {
        return next(new Error("Account Not Found !", { cause: 404 }));
    }
    if (user.role === "Admin") {
        return next(new Error("Role Allready Admin !", { cause: 400 }));
    }
    user.role = "Admin";
    await user.save();
    return res.status(200).json({ message: "Done", user: user._id });
});
//  Social Login
