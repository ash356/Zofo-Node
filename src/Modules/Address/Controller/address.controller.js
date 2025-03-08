import { asyncHandler } from "../../../Utils/errorHandling.js";
import userModel from "../../User/user.model.js";

// addToaddress
export const addToAddress = asyncHandler(async (req, res, next) => {
    // Destructing from body
    const { name, street, city, phone } = req.body;
    const { addresses } = await userModel.findByIdAndUpdate(req.user._id, {
        $push: { addresses: { name, street, city, phone } }
    }, { new: true }
    )
    !addresses && next(new Error("Address Not Found !", { cause: 404 }));
    addresses && res.status(201).json({ message: "Added To Addresses", addresses });
})
// removeFromaddress
export const removeFromAddress = asyncHandler(async (req, res, next) => {
    // Destructing from body
    const { addressId } = req.body;
    // Check 
    if (!addressId) {
        return next(new Error("addressId Required !", { cause: 400 }));
    }
    const { addresses } = await userModel.findByIdAndUpdate(req.user._id, {
        $pull: { addresses: { _id: addressId } }
    }, { new: true }
    )
    !addresses && next(new Error("Address Not Found !", { cause: 404 }));
    addresses && res.status(200).json({ message: "Deleted From Addresses", addresses });
})
// getUseraddress
export const getUserAddress = asyncHandler(async (req, res, next) => {
    const { addresses } = await userModel.findById(req.user._id)
    if (!addresses || addresses.length === 0) {
        return next(new Error("No Addresses Found!", { cause: 404 }));
    }
    return res.status(200).json({ message: "Done", addresses });
})
