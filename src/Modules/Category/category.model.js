import mongoose, { Schema, model, Types } from "mongoose";
// Category Schema
const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category Name is Required'],
        trim: true,  // to remove spaces before and after
        unique: true,
        minlength: 3,
        lowercase: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,

    },
    image: {
        secure_url: { type: String },
        public_id: { type: String },
    }
},
    { timestamps: true })
// 
// categorySchema.post('init', (doc) => {
//     doc.image = `${process.env.BASE_URL}/category/` + doc.image
// })
// To Handle Error If The Model Allready Exist
const categoryModel = mongoose.models.Category || model("Category", categorySchema)
export default categoryModel;