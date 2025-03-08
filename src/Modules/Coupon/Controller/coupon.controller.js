import { asyncHandler } from "../../../Utils/errorHandling.js";
import couponModel from "../coupon.model.js";

// createCoupon
export const createCoupon = asyncHandler(async (req, res, next) => {
    // Destructing from body
    const { code, expires, discount } = req.body;
    // Set Created By
    const createdBy = req.user._id;
    // Validate Data
    if (!code || !expires || !discount) {
        return next(new Error("Invalid Data !", { cause: 400 }));
    }
    // check Expiration
    if (new Date(expires) <= new Date()) {
        return next(new Error("Invalid Expiration Date !", { cause: 400 }));
    }
    // Check Coupon Exist
    const existingCoupon = await couponModel.findOne({ code });
    if (existingCoupon) {
        return next(new Error("Duplicated Coupon Code !", { cause: 409 }));
    }
    const coupon = await couponModel.create({ code, expires, discount, createdBy })
    return res.status(201).json({ message: 'Done', coupon });
})
// getCoupons
export const getCoupon = asyncHandler(async (req, res, next) => {
    const { code } = req.body
    const coupon = await couponModel.findOne({ code })
    if (!coupon) {
        return next(new Error("Coupon Not Found !", { cause: 404 }));
    }
    return res.status(200).json({ message: "Done", coupon });
})
// deleteCoupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const { code } = req.body
    const coupon = await couponModel.findOneAndDelete({ code })
    if (!coupon) {
        return next(new Error("Coupon Not Found !", { cause: 404 }));
    }
    return res.status(200).json({ message: "Done", coupon });
})
