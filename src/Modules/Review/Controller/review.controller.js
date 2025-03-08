import { asyncHandler } from "../../../Utils/errorHandling.js";
import reviewModel from "../review.model.js";
import productModel from "../../Product/product.model.js"
// getAllReviews
export const getAllReviews = asyncHandler(async (req, res, next) => {
    const reviews = await reviewModel.find({}).populate('userId', 'userName email');
    return res.status(200).json({ message: "Done", reviews })
})
// Create Review
export const createReview = asyncHandler(async (req, res, next) => {
    // Destructing from body
    const { title, productId, ratingAverage } = req.body;
    if (!productId || !title || !ratingAverage) {
        return next(new Error("Invalid Data !", { cause: 400 }));
    }
    // Check Product 
    const product = productModel.findById(productId)
    if (!product) {
        return next(new Error("Product Not Found !", { cause: 404 }));
    }
    // Check if the user already reviewed this product
    const existingReview = await reviewModel.findOne({ productId, userId: req.user._id });
    if (existingReview) {
        return next(new Error("You Have Already Reviewed On This Product !", { cause: 400 }));
    }
    // Query
    const review = await reviewModel.create({ title, productId, ratingAverage, userId: req.user._id });
    return res.status(201).json({ message: "Review Added", review });
})
// Get Review
export const getReview = asyncHandler(async (req, res, next) => {
    // Destructing id From params
    const { id } = req.params;
    // Query
    const review = await reviewModel.findById(id).populate('userId', 'userName')
    // Check review
    if (!review) {
        return next(new Error('Review Not Found !', { cause: 404 }))

    }
    // Retrun
    return res.status(200).json({ message: "Done", review })
})
// Update Review
export const updateReview = asyncHandler(async (req, res, next) => {
    // Destructing id From params
    const { id } = req.params;
    // Destructing from body
    const { title, ratingAverage } = req.body;
    const review = await reviewModel.findById(id)
    // Check review
    if (!review) {
        return next(new Error('Review Not Found !', { cause: 404 }))
    }
    // Check Review Owner casting into string
    if (review.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Not Allowed Not Your Review !', { cause: 403 }))
    }
    // Update Query
    if (title) review.title = title;
    if (ratingAverage) review.ratingAverage = ratingAverage;
    await review.save();
    return res.status(200).json({ message: "Review Updated", review })
})
// Delete Review
export const deleteReview = asyncHandler(async (req, res, next) => {
    // Destructing id From params
    const { id } = req.params;
    const review = await reviewModel.findById(id)
    // Check review
    if (!review) {
        return next(new Error('Review Not Found !', { cause: 404 }))
    }
    // Check Review Owner casting into string
    if (req.user.role !== 'Admin' && review.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Not Allowed To Delete Review !', { cause: 403 }))
    }
    // Delete Query
    const rev = await reviewModel.findByIdAndDelete(id)
    return res.status(200).json({ message: "Review Deleted", rev })
})