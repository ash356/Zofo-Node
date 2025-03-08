import mongoose, { Schema, model, Types } from "mongoose";
// Review Schema
const reviewSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    userId: {
        type: Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: Types.ObjectId,
        ref: "Product"
    },
    ratingAverage: {
        type: Number,
        min: 1,
        max: 5,
    }
}, { timestamps: true })
// Pre Hook To Populate User
// /^find/ => regex => Any Thing Start with find
// reviewSchema.pre(/^find/, function () {
//     this.populate('userId', 'userName email')
// })
// review Model
const reviewModel = mongoose.models.Review || model("Review", reviewSchema);
export default reviewModel