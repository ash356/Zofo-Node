import mongoose, { Schema, model, Types } from "mongoose";
// Cart Schema
const cartSchema = new Schema({
    cartItems: [{
        productId: {
            type: Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: Number
    }],
    userId: {
        type: Types.ObjectId,
        ref: 'User'
    },
    totalPrice: Number,
    discount: Number,
    totalPriceAfterDiscount: Number,
}, { timestamps: true });

const cartModel = mongoose.models.Cart || model("Cart", cartSchema);
export default cartModel
