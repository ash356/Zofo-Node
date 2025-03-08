import slugify from "slugify";
import categoryModel from "../category.model.js"
import cloudinary from '../../../Utils/cloudinary.js'
import { asyncHandler } from "../../../Utils/errorHandling.js";
import * as entityService from "../../../Services/entityService.js";
// Create Category 
export const createCategory = asyncHandler(async (req, res, next) => {
    const checkcategory = await categoryModel.findOne({ name: req.body.name });
    // Check if category Exist 
    if (checkcategory) {
        return next(new Error(`Duplicated ${req.body.name} Category !`, { cause: 409 }));
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            {
                folder: `${process.env.APP_NAME}/categories`,
            })
        req.body.image = { secure_url, public_id }
    }
    req.body.name = (req.body.name).toLowerCase()
    req.body.slug = slugify(req.body.name)
    const category = await categoryModel.create(req.body);
    return res.status(201).json({ message: `Done`, category });
})
// getAllCategories
export const getAllCategories = asyncHandler(async (req, res, next) => {
    // Query
    const categories = await categoryModel.find({});
    return res.status(200).json({ message: "Done", categories })
})
// Get Category By Id
export const getCategory = entityService.findEntity(categoryModel, 'Category')
// Update Category
export const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
        return next(new Error("Category not found!", { cause: 404 }));
    }
    if (req.file) {
        // Destroy Old Image
        await cloudinary.uploader.destroy(category.image.public_id);
        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/categories`,
        });
        req.body.image = { secure_url, public_id };
    }
    // Update category name & slug if provided
    if (req.body.name) {
        req.body.name = (req.body.name).toLowerCase();
        req.body.slug = slugify(req.body.name);
    }
    // Update the category in the database
    const updatedcategory = await categoryModel.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: "Done", updatedcategory });
});
// Delete Category
export const deleteCategory = entityService.deleteEntity(categoryModel, 'Category')
// Insert Many Categories for one time Use in test mood
export const inserManyCategories = asyncHandler(async (req, res, next) => {
    // Destructing from body
    const { categories } = req.body;
    if (!Array.isArray(categories) || categories.length === 0) {
        return next(new Error('Invalid input: categories must be a non-empty array', { cause: 400 }));
    }
    // Process categories to include slugs
    const categoryDocs = categories.map(category => ({
        name: category.name,
        slug: slugify(category.name),
        image: category.image
    }));
    // Insert multiple categories
    const insertedCategories = await categoryModel.insertMany(categoryDocs, { ordered: false });

    return res.status(201).json({ message: "Categories Added", categories: insertedCategories });

})