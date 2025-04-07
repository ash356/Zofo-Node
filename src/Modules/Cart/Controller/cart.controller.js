import { asyncHandler } from "../../../Utils/errorHandling.js"
import cartModel from "../cart.model.js";
import productModel from "../../Product/product.model.js";
import couponModel from "../../Coupon/coupon.model.js";
const calculateTotalCartPrice = (cart) => {
    // Calculat Total Price
    let totalPrice = 0;
    cart.cartItems.forEach((ele) => {
        totalPrice += ele.price * ele.quantity
    })
    cart.totalPrice = totalPrice
    // Calculate Total Price After Discount
    if (cart.totalPriceAfterDiscount || cart.totalPriceAfterDiscount == 0) {
        cart.totalPriceAfterDiscount =
            (cart.totalPrice - (cart.totalPrice * cart.discount) / 100).toFixed(2);
    }
}
//  Add To Cart
export const addToCart = asyncHandler(async (req, res, next) => {
    // Destructing Data from Body
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
        return next(new Error("Invalid Data !", { cause: 400 }));
    }
    // Get Product Price
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new Error("Invalid Product !", { cause: 404 }));
    }
    const price = product.price;
    // Check Exist Cart
    const existCart = await cartModel.findOne({ userId: req.user._id }).populate('cartItems.productId', 'price colors')
    if (!existCart) {
        // Calculat Total Price
        let totalPrice = price * quantity
        // Create Query
        const cart = await cartModel.create({
            cartItems: [{ productId, quantity, price }],
            userId: req.user._id,
            totalPrice
        })
        return res.status(201).json({ message: "New Cart Created", cart })
    }
    // Add To Exist Cart
    else {
        // Check if the Product Added Before
        const findProduct = existCart.cartItems.find((ele) => ele.productId?.id == productId)
        // Increase Quantity
        if (findProduct) {
            findProduct.quantity += quantity
        }
        // Add New Product
        else {
            existCart.cartItems.push({ productId, quantity, price })
        }
        // Calculat Total Price
        calculateTotalCartPrice(existCart)
        // Save Update
        await existCart.save()
        return res.status(201).json({ message: "Added To Cart", existCart })
    }
})
//  Remove From Cart
export const removeFromCart = asyncHandler(async (req, res, next) => {
    // Destructing from body
    const { productId } = req.body;
    // Check 
    if (!productId) {
        return next(new Error("productId Required !", { cause: 400 }));
    }
    const cart = await cartModel.findOneAndUpdate({ userId: req.user._id }, {
        $pull: { cartItems: { productId } }
    },
        { new: true }
    )
    if (!cart) {
        return next(new Error("Cart Items Not Found !", { cause: 404 }));
    }
    // Calculat Total Price
    calculateTotalCartPrice(cart)
    await cart.save()
    return res.status(200).json({ message: "Done", cart });
})
// update Cart Quantity
export const updateCartQuantity = asyncHandler(async (req, res, next) => {
    // Destructing Data From Body
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
        return next(new Error("Invalid Data !", { cause: 400 }));
    }
    // Check Exist Cart
    const cart = await cartModel.findOne({ userId: req.user._id }).populate('cartItems.productId', 'price colors')
    const findProduct = cart.cartItems.find((ele) => ele.productId.id == productId)
    if (!findProduct) {
        return next(new Error("Item Not Found !", { cause: 404 }));
    }
    if (findProduct) {
        findProduct.quantity = quantity
    }
    // Calculate Total Price 
    calculateTotalCartPrice(cart)
    // Save Update
    await cart.save()
    return res.status(201).json({ message: "Added To Cart", cart })
})
// Apply Coupon
export const applyCoupon = asyncHandler(async (req, res, next) => {
    // Destructing Data from Body
    const { code } = req.body
    // FindCoupon 
    const coupon = await couponModel.findOne({ code })
    // Check Coupon
    if (!coupon) {
        return next(new Error("Coupon Not Found !", { cause: 404 }));
    }
    // Check Expires
    if (new Date(coupon.expires) <= new Date()) {
        return next(new Error("Coupon Expired !", { cause: 400 }));
    }
    // Cart Query
    const cart = await cartModel.findOne({ userId: req.user._id });
    // Calculate Total Price After Coupon 
    cart.totalPriceAfterDiscount = (cart.totalPrice - (cart.totalPrice * coupon.discount) / 100).toFixed(2);
    cart.discount = coupon.discount;
    // Save Update
    await cart.save();
    return res.status(201).json({ message: "Coupon Applied", cart });
})
// Get User Cart
export const getUserCart = asyncHandler(async (req, res, next) => {
    // Cart Query
    const cart = await cartModel.findOne({ userId: req.user._id }).select('cartItems totalPrice totalPriceAfterDiscount');
    if (!cart) {
        return next(new Error("Cart Items Not Found !", { cause: 404 }));
    }
    return res.status(201).json({ message: "Done", length: cart.cartItems.length, cart });
})
// Clear Cart
export const clearCart = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const cart = await cartModel.findOneAndDelete({ userId });
    if (!cart) {
        return next(new Error(`Cart Not Found!`, { cause: 404 }));
    }
    // Success response
    return res.status(200).json({ message: `Cart Deleted` });
})