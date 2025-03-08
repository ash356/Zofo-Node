import mongoose, { Schema, model, Types } from "mongoose";
// Subcategory Schema
const subcategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "Category"
    },
    image: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
    }
}, { timestamps: true })
// Subcategory Model
const subcategoryModel = mongoose.models.Subcategory || model("Subcategory", subcategorySchema);
export default subcategoryModel