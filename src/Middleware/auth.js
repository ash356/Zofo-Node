import userModel from "../Modules/User/user.model.js";
import { asyncHandler } from "../Utils/errorHandling.js";
import { verifyToken } from "../Utils/generateAndVerifyToken.js";
// System Roles
export const roles = {
    Admin: "Admin",
    User: "User"
}
// Authentication Middleware
export const auth = asyncHandler(async (req, res, next) => {
    const { authentication } = req.headers;
    // 01- Validate Bearer Key
    if (!authentication?.startsWith(process.env.BEARER_KEY)) {
        return next(new Error("Invalid Bearer Key ❗", { cause: 401 }));
    }
    // 02- Split Token
    const token = authentication.split(process.env.BEARER_KEY)[1];
    if (!token) {
        return next(new Error("Token Is Required ❗", { cause: 401 }));
    }
    // 03- Decoded Token
    const decoded = verifyToken({ token });
    if (!decoded?.id) {
        return next(new Error("Invalid Token ❗", { cause: 401 }));
    }
    // 04- Find Auth User
    const authUser = await userModel
        .findById(decoded.id)
        .select("userName email role status confirmEmail passwordChangedAt");
    if (!authUser || authUser.deleted) {
        return next(new Error("User Not Found ❗", { cause: 404 }));
    }
    // 05- Compare the password change date with the token's creation date
    const tokenCreationDate = new Date(decoded.iat * 1000); // To Milliseconds
    if (authUser.passwordChangedAt > tokenCreationDate) {
        return next(new Error("Password has been changed ❗ Please Login Again.", { cause: 401 }));
    }
    // 06- Set User to Request
    req.user = authUser;
    return next();
});
// Authorization Middleware
export const authorization = (accessRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        if (!accessRoles.includes(req.user.role)) {
            return next(new Error("Not Authorized User ❗", { cause: 403 }));
        }
        return next();
    })
}

