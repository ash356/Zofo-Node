import slugify from "slugify";
import { asyncHandler } from "../../../Utils/errorHandling.js";
import brandModel from "../brand.model.js";
import * as entityService from "../../../Services/entityService.js";
import cloudinary from '../../../Utils/cloudinary.js'
// Create brand 
// export const createBrand = entityService.createEntity(brandModel, 'Brand')
// Create Brand With CLoudinary Upload
export const createBrand = asyncHandler(async (req, res, next) => {
    const checkBrand = await brandModel.findOne({ name: req.body.name });
    // Check if brand Exist 
    if (checkBrand) {
        return next(new Error(`Duplicated ${req.body.name} Brand !`, { cause: 409 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        {
            folder: `${process.env.APP_NAME}/brands`,
        })
    req.body.image = { secure_url, public_id }
    req.body.name = (req.body.name).toLowerCase()
    req.body.slug = slugify(req.body.name)
    const brand = new brandModel(req.body)
    await brand.save();
    return res.status(201).json({ message: "Done", brand })
})
// Get All Brands
export const getAllBrands = asyncHandler(async (req, res, next) => {
    const brands = await brandModel.find({})
    return res.status(200).json({ message: "Done", brands })
})
// Get brand By Id
export const getBrand = asyncHandler(async (req, res, next) => {
    // Destructing id From params
    const { id } = req.params;
    // Query
    const brand = await brandModel.findById(id)
    // Check brand
    if (!brand) {
        return next(new Error(`Brand Not Found !`, { cause: 404 }))
    }
    // Retrun
    return res.status(200).json({ message: "Done", brand })
})
// Update Brand
export const updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brandModel.findById(id);
    if (!brand) {
        return next(new Error("Brand not found!", { cause: 404 }));
    }
    if (req.file) {
        // Destroy Old Image
        await cloudinary.uploader.destroy(brand.image.public_id);
        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APP_NAME}/brands`,
        });
        req.body.image = { secure_url, public_id };
    }
    // Update brand name & slug if provided
    if (req.body.name) {
        req.body.name = (req.body.name).toLowerCase();
        req.body.slug = slugify(req.body.name);
    }
    // Update the brand in the database
    const updatedBrand = await brandModel.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: "Done", updatedBrand });
});

// Delete Brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brandModel.findById(id);
    if (!brand) {
        return next(new Error("Brand not found!", { cause: 404 }));
    }
    // Delete the image from Cloudinary
    if (brand.image?.public_id) {
        await cloudinary.uploader.destroy(brand.image.public_id);
    }
    await brandModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Done" });
});

// // INsert Many brands for one time Use
// export const insertManyBrands = asyncHandler(async (req, res, next) => {
//     // Destructing from body
//     const { brands } = req.body;
//     if (!Array.isArray(brands) || brands.length === 0) {
//         return next(new Error('Invalid input: brands must be a non-empty array', { cause: 400 }));
//     }
//     // Process brands to include slugs
//     const brandDocs = brands.map(brand => ({
//         name: brand.name,
//         slug: slugify(brand.name),
//         image: brand.image
//     }));
//     // Insert multiple brands
//     const insertedbrands = await brandModel.insertMany(brandDocs, { ordered: false });

//     return res.status(201).json({ message: "Brands Added", brands: insertedbrands });

// })