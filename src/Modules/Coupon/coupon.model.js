import mongoose, { Schema, model, Types } from "mongoose";
// Coupon Schema
const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    expires: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    }
    ,
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    usedBy: { type: Types.ObjectId, ref: "User" },
    image: { type: Object }
}, { timestamps: true })
// coupon Model
const couponModel = mongoose.models.Coupon || model("Coupon", couponSchema);
export default couponModel