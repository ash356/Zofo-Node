import mongoose, { Schema, model, Types } from "mongoose";
// Brand Schema
const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
        lowercase: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    image: {
        type: Object,
    },
    image: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
    }
},
    { timestamps: true });

// While Get
brandSchema.post('init', (doc) => {
    doc.image = `${process.env.BASE_URL}/brand/` + doc.image
})
// Brand Model
const brandModel = mongoose.models.Brand || model("Brand", brandSchema);
export default brandModel