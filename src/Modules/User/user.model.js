import { hash } from "../../Utils/hashAndCompare.js";
import mongoose, { Schema, model, Types } from "mongoose";
// user Schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "FirstName Is Required"],
        min: [2, "Minimum Length 2 Chars"],
        min: [15, "Maximum Length 15 Chars"],
        lowercase: true,
    },
    lastName: {
        type: String,
        required: [true, "LastName Is Required"],
        min: [2, "Minimum Length 2 Chars"],
        min: [15, "Maximum Length 15 Chars"],
        lowercase: true,
    },
    userName: {
        type: String,
        required: [true, "UserName Is Required"],
        min: [2, "Minimum Length 2 Chars"],
        min: [15, "Maximum Length 15 Chars"],
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, "Email Is Required"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordChangedAt: {
        type: Date
    },
    age: Number,
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male',
        lowercase: true
    },
    phone: {
        type: String
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Online', 'Offline', 'Blocked'],
        default: 'Offline'
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    profilePic: {
        type: Object,
    },
    profilePicId: {
        type: String
    },
    coverPic: {
        type: [Object]
    },
    otpCode: String,
    wishList: [{ type: Types.ObjectId, ref: "Product" }],
    addresses: [{
        name: String,
        street: String,
        city: String,
        phone: String
    }],
},
    { timestamps: true }
)
// Hash Password Using Mongoose Hooks 
// userSchema.pre('save', function () {
//     // Check Password Change
//     if (!this.isModified("password")) return next();
//     // Hashing Password
//     this.password = hash({ plainText: this.password });
//     next();
// })

// userSchema.pre('findOneAndUpdate', function () {
//     if (!this._update.password) return;
//     // Hashing Password
//     this._update.password = hash({ plainText: this._update.password });

// })
// user Model
const userModel = mongoose.models.User || model("User", userSchema);
export default userModel