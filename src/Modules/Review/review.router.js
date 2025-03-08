import { Router } from "express";
import * as reviewController from "./Controller/review.controller.js"
import { auth, authorization, roles } from "../../Middleware/auth.js"
import { validation } from "../../Middleware/validation.js";
import * as validators from "./review.validation.js"
const router = Router()
// Get All Reviews
router.get('/', reviewController.getAllReviews)
// Add Review User Only
router.post('/', auth, authorization(roles.User),
    validation(validators.createReview), reviewController.createReview)
// Find Review 
router.get('/:id', validation(validators.getReview), reviewController.getReview)
// Update Review User Owner Only
router.patch('/:id', auth, authorization(roles.User), validation(validators.updateReview), reviewController.updateReview)
// Delete Review User Admin
router.delete('/:id', auth, authorization([roles.User, roles.Admin]), validation(validators.deleteReview), reviewController.deleteReview)

export default router