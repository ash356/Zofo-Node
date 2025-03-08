import categoryRouter from "../Modules/Category/category.router.js"
import subcategoryRouter from "../Modules/Subcategory/subcategory.router.js"
import brandRouter from "../Modules/Brand/brand.router.js"
import productRouter from "../Modules/Product/product.router.js"
import userRouter from '../Modules/User/user.router.js'
import authRouter from '../Modules/Auth/auth.router.js'
import reviewRouter from "../Modules/Review/review.router.js"
import wishlistRouter from "../Modules/Wishlist/wishlist.router.js"
import addressRouter from "../Modules/Address/address.router.js"
import couponRouter from "../Modules/Coupon/coupon.router.js"
import cartRouter from "../Modules/Cart/cart.router.js"
import orderRouter from "../Modules/Order/order.router.js"
const routers = (app) => {
    // Category Router 
    app.use("/categories", categoryRouter)
    // Category Router 
    app.use("/subcategories", subcategoryRouter)
    // Brand Router 
    app.use("/brands", brandRouter)
    // Product Router 
    app.use("/products", productRouter)
    // User Router 
    app.use("/users", userRouter)
    // Auth Router 
    app.use("/auth", authRouter)
    // Review Router
    app.use("/reviews", reviewRouter)
    // Wishlist Router
    app.use("/wishlist", wishlistRouter)
    // Address Router
    app.use("/addresses", addressRouter)
    // Coupon Router
    app.use("/coupons", couponRouter)
    // Cert Router
    app.use("/carts", cartRouter)
    // Order Router
    app.use("/orders", orderRouter)
}
export default routers