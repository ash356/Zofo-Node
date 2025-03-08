import { asyncHandler } from "../../../Utils/errorHandling.js";
import couponModel from "../../../Modules/Coupon/coupon.model.js"
import productModel from "../../../Modules/Product/product.model.js"
import orderModel from "../order.model.js";
import cartModel from "../../Cart/cart.model.js";
import generateInvoice from "../../../Services/createInvoice.js";

// Create Order
export const createOrder = asyncHandler(
    async (req, res, next) => {
        // Destructing Data From Body
        const { city, street, phone, couponCode, note, paymentType } = req.body
        if (!req.body.products) {
            // Find user Cart
            const cart = await cartModel.findOne({ userId: req.user._id })
            if (!cart?.cartItems?.length) {
                return next(new Error("Empty Cart !", { cause: 400 }));
            }
            req.body.isCart = true
            req.body.products = cart.cartItems
        }
        // Check Coupon
        if (couponCode) {
            const coupon = await couponModel.findOne({ code: couponCode, usedBy: { $nin: req.user._id } })
            if (!coupon || (new Date(coupon.expires) <= new Date())) {
                return next(new Error("Invalid Or Expired Coupon !", { cause: 400 }));
            }
            // Set Into Body
            req.body.coupon = coupon
        }
        // Check Products
        const productsList = []
        let subtotalPrice = 0;
        const productIds = []
        for (let product of req.body.products) {
            const checkProduct = await productModel.findOne({
                _id: product.productId,
                stock: { $gte: product.quantity },
                isDeleted: false
            })
            if (!checkProduct) {
                return next(new Error(`Invalid Product : ${product?.productId} !`, { cause: 404 }));
            }
            if (req.body.isCart) {
                // conver product from bson into object
                product = product.toObject()
            }
            productIds.push(product.productId)
            // Set Values
            product.name = checkProduct.name
            product.slug = checkProduct.slug
            product.productId = checkProduct._id
            // product.quantity = checkProduct.quantity
            product.unitPrice = checkProduct.price
            product.finalPrice = parseFloat((product.quantity * checkProduct.price).toFixed(2))
            productsList.push(product)
            subtotalPrice += product.finalPrice
            // console.log(subtotalPrice);
        }
        // Calculate Discount
        const discount = req.body.coupon ? (subtotalPrice * req.body.coupon.discount) / 100 : 0;
        // Calc Total Price
        const totalPrice = parseFloat((subtotalPrice - discount).toFixed(2));
        // Dummy Order
        const dummyOrder = {
            userId: req.user._id,
            address: { city, street, phone },
            phone,
            note,
            products: productsList,
            couponId: req.body.coupon?._id,
            subtotalPrice,
            totalPrice,
            paymentType,
            orderStatus: paymentType == "Card" ? "WaitPayment" : "Placed"
        }
        // Create Query
        const order = await orderModel.create(dummyOrder)
        // Decrease Product Stock
        for (const product of req.body.products) {
            await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } })
        }
        // Change Coupon UsedBy 
        if (req.body.coupon) {
            await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } })
        }
        // Remove Items from Cart
        if (req.body.isCart) {
            await cartModel.updateOne({ userId: req.user._id }, { cartItems: [] })
        }
        else {
            await cartModel.updateOne(
                { userId: req.user._id },
                { $pull: { cartItems: { productId: { $in: productIds } } } }
            )

        }
        // Populate to create Invoice
        const populatedOrder = await orderModel.findById(order._id)
            .populate("userId")
            .populate("products.productId");
        generateInvoice(populatedOrder, res, order.address)
        return res.status(201).json({ message: "Done", order })
    })
// Cancel Order
export const cancelOrder = asyncHandler(async (req, res, next) => {
    // Destructing 
    const { orderId } = req.params;
    const { reason } = req.body
    const order = await orderModel.findOne({ _id: orderId, userId: req.user._id })
    // Check Order and Order Status
    if (!order) return next(new Error(`order not found !`, { cause: 404 }))
    if ((order?.orderStatus != 'Placed' && order?.paymentType == 'Cash')
        || (order?.orderStatus != 'WaitPayment' && order?.paymentType == 'Card')) {
        return next(new Error(`Can't Cancel Order ! Status changed to ${order?.orderStatus}`, { cause: 400 }))
    }
    // Query Update 
    const cancelOrder = await orderModel.updateOne({ _id: order._id }, { orderStatus: 'Canceled', reason, updatedBy: req.user._id })
    if (!cancelOrder.matchedCount) {
        return next(new Error(`Can't Cancel Order !`, { cause: 400 }))
    }
    // Increase Product Quantity
    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: parseInt(product.quantity) } })
    }
    // Change Coupon UsedBy 
    if (order.couponId) {
        await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } })
    }
    return res.status(201).json({ message: "Done" })
})
// Update Order Status By Admin
export const updateOrder = asyncHandler(async (req, res, next) => {
    // Destructing 
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    const order = await orderModel.findOne({ _id: orderId })
    // Check Order and Order Status
    if (!order || order?.orderStatus == 'Canceled') return next(new Error(`order not found or canceled !`, { cause: 404 }))
    // Query Update 
    const updateOrder = await orderModel.updateOne({ _id: order._id }, { orderStatus, updatedBy: req.user._id })
    if (!updateOrder.matchedCount) {
        return next(new Error(`Can't Update Order Status !`, { cause: 400 }))
    }

    return res.status(201).json({ message: "Done" })
})
// Get Order Invoice
export const getOrderInvoice = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId)
        .populate("userId")
        .populate("products.productId");
    if (!order) return next(new Error(`order not found !`, { cause: 404 }))
    const firstAddress = (order.userId.addresses && order.userId.addresses.length > 0)
        ? order.userId.addresses[0]
        : {};
    generateInvoice(order, res, firstAddress);
})