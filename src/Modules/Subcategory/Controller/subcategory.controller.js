import slugify from "slugify";
import { asyncHandler } from "../../../Utils/errorHandling.js";
import subcategoryModel from "../subcategory.model.js";
import cloudinary from '../../../Utils/cloudinary.js'
import * as entityService from "../../../Services/entityService.js";

// Create Category 
export const createsubcategory = asyncHandler(async (req, res, next) => {
    // Destructing from body
    const { name, categoryId } = req.body;
    // Query
    const subcategory = await subcategoryModel.findOne({ name: name.toLowerCase() });
    // Check if subcategory Exist 
    if (subcategory) {
        return next(new Error('Duplicated Subcategory !', { cause: 409 }));
    }
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            {
                folder: `${process.env.APP_NAME}/subcategories`,
            })
        req.body.image = { secure_url, public_id }
    }
    const newsubcategory = await subcategoryModel.create({ name: name.toLowerCase(), slug: slugify(name), categoryId, image: req.body.image });
    return res.status(201).json({ message: "Subcategory Added", newsubcategory });
})
// getAllSubcategories
export const getAllSubcategories = asyncHandler(async (req, res, next) => {
    let filter = {}
    if (req.params.categoryId) {
        filter = { categoryId: req.params.categoryId }
    }
    const Subcategories = await subcategoryModel.find(filter).populate('categoryId', 'name slug -_id');
    return res.status(200).json({ message: "Done", Subcategories })
})
// Get subcategory By Id
export const getsubcategory = asyncHandler(async (req, res, next) => {
    // Destructing id From params
    const { id } = req.params;
    // Query
    const subcategory = await subcategoryModel.findById(id)
    // Check subcategory
    if (!subcategory) {
        return next(new Error('Subcategory Not Found !', { cause: 404 }))
    }
    // Retrun
    return res.status(200).json({ message: "Done", subcategory })
})
// Update subcategory
export const updatesubcategory = asyncHandler(async (req, res, next) => {
    // Destructing id From params
    const { id } = req.params;
    const subcategory = await subcategoryModel.findById(id);
    if (!subcategory) {
        return next(new Error("Subcategory not found!", { cause: 404 }));
    }
    if (req.file) {
        // Destroy Old Image
        await cloudinary.uploader.destroy(subcategory.image.public_id);
        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/subcategories`,
        });
        req.body.image = { secure_url, public_id };
    }
    // Update subcategory name & slug if provided
    if (req.body.name) {
        req.body.name = (req.body.name).toLowerCase();
        req.body.slug = slugify(req.body.name);
    }
    if (req.body.categoryId) {
        req.body.categoryId = req.body.categoryId
    }
    // Update the subcategory in the database
    const updatedsubcategory = await subcategoryModel.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: "Done", updatedsubcategory });
})
// Delete subcategory
export const deletesubcategory = entityService.deleteEntity(subcategoryModel, 'Subcategory')
// inserManySubcategories for one time use
export const inserManySubcategories = asyncHandler(async (req, res, next) => {
    const { subcategories } = req.body;

    if (!Array.isArray(subcategories) || subcategories.length === 0) {
        return next(new Error('Invalid input: subcategories must be a non-empty array', { cause: 400 }));
    }

    const subcategoryDocs = subcategories.map(subcategory => ({
        name: subcategory.name,
        slug: slugify(subcategory.name),
        categoryId: subcategory.categoryId,
    }));

    const insertedSubcategories = await subcategoryModel.insertMany(subcategoryDocs, { ordered: false });

    return res.status(201).json({ message: "Subcategories Added", subcategories: insertedSubcategories });
});
