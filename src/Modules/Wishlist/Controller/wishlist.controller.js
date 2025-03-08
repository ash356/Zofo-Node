import { asyncHandler } from "../../../Utils/errorHandling.js";
import userModel from "../../User/user.model.js";

// addToWishlist
export const addToWishlist = asyncHandler(async (req, res, next) => {
    // Destructing from body
    const { productId } = req.body;
    // Check 
    if (!productId) {
        return next(new Error("ProductId Required !", { cause: 400 }));
    }
    const wishlist = await userModel.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishList: productId } // addToSet to Avoid Duplicate
    }, { new: true }
    )
    !wishlist && next(new Error("Wishlist Not Found !", { cause: 404 }));
    wishlist && res.status(201).json({ message: "Added To Wishlist", email: wishlist.email, wishlist: wishlist.wishList });
})
// removeFromWishlist
export const removeFromWishlist = asyncHandler(async (req, res, next) => {
    // Destructing from body
    const { productId } = req.body;
    // Check 
    if (!productId) {
        return next(new Error("ProductId Required !", { cause: 400 }));
    }
    const wishlist = await userModel.findByIdAndUpdate(req.user._id, {
        $pull: { wishList: productId }
    }, { new: true }
    )
    !wishlist && next(new Error("Wishlist Not Found !", { cause: 404 }));
    wishlist && res.status(200).json({ message: "Deleted From Wishlist", email: wishlist.email, wishlist: wishlist.wishList });
})
// getUserWishlist
export const getUserWishlist = asyncHandler(async (req, res, next) => {
    const { wishList } = await userModel.findById(req.user._id)
    if (!wishList || wishList.length === 0) {
        return next(new Error("Wishlist Not Found !", { cause: 404 }));
    }
    return res.status(200).json({ message: "Done", wishList });
})
