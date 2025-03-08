import mongoose, { Schema, model, Types } from "mongoose";
// Order Schema
const orderSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "User" },
        products: [{
            name: { type: String, required: true },
            slug: { type: String, required: true },
            productId: { type: Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, default: 1, required: true },
            unitPrice: { type: Number, default: 1, required: true },
            finalPrice: { type: Number, default: 1, required: true },
        }],
        address: { type: Object, required: true },
        phone: [{ type: String, required: true }],
        couponId: { type: Types.ObjectId, ref: "Coupon", required: false },
        subtotalPrice: { type: Number, default: 1, required: true },
        totalPrice: { type: Number, default: 1, required: true },
        paymentType: {
            type: String, default: "Cash", enum: ["Cash", "Card"]
        },
        orderStatus: {
            type: String,
            default: "Placed",
            enum: ["WaitPayment", "Placed", "Canceled", "Rejected", "OnWay", "Delivered"]
        },
        note: { type: String },
        reason: { type: String },
        updatedBy: { type: Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

const orderModel = mongoose.models.Order || model("Order", orderSchema);
export default orderModel;
