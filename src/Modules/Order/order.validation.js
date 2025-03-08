import joi from "joi";
import { generalFields } from "../../Middleware/validation.js";
// Create Order
export const createOrder = joi.object({
    city: joi.string().min(3).required(),
    street: joi.string().min(3).required(),
    phone: joi.array().items(
        generalFields.phone
    ).min(1).max(3).required(),
    couponCode: joi.string().min(3),
    note: joi.string().min(1),
    paymentType: joi.string().valid('Cash', 'Card'),
    products: joi.array().items(
        joi.object({ productId: generalFields.id, quantity: joi.number().positive().integer().min(1).required() }).required()
    )
})
// Cancel Order
export const cancelOrder = joi.object({
    orderId: generalFields.id,
    reason: joi.string().min(1),
})
// Update Order
export const updateOrder = joi.object({
    orderId: generalFields.id,
    orderStatus: joi.string().valid('OnWay', 'Delivered').required(),
})
// getOrderInvoice
export const getOrderInvoice = joi.object({
    orderId: generalFields.id
})

