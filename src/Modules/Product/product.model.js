import mongoose, { Schema, model, Types } from "mongoose";
// product Schema
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 8

    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    colors: {
        type: [String],
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        dffault: 0
    },
    coverPic: {
        type: Object,
    },
    productImages: {
        type: [Object]
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "Category"
    },
    subcategoryId: {
        type: Types.ObjectId,
        ref: "Subcategory"
    },
    brandId: {
        type: Types.ObjectId,
        ref: "Brand"
    },
    averageRating: {
        type: Number,
        min: 1,
        max: 5
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    soldCount: {
        type: Number,
        required: true,
        default: 0
    },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
// Virtual Populate
productSchema.virtual('Reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId'
})
// hook
// productSchema.post('init', (doc) => {
//     if (doc.coverPic && doc.productImages) {
//         const productImgs = []
//         doc.coverPic = `${process.env.BASE_URL}/product/` + doc.coverPic;
//         doc.productImages.forEach((ele) => {
//             productImgs.push(`${process.env.BASE_URL}/product/` + ele);
//         })
//         doc.productImages = productImgs;
//     }

// })
// Product Model
const productModel = mongoose.models.Product || model("Product", productSchema);
export default productModel