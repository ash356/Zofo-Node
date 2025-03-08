import slugify from "slugify";
import { asyncHandler } from "../../../Utils/errorHandling.js";
import productModel from "../product.model.js";
import * as entityService from "../../../Services/entityService.js";
import * as queryService from "../../../Services/queryService.js";
import cloudinary from '../../../Utils/cloudinary.js'
// Create Product
export const createProduct = asyncHandler(async (req, res, next) => {
    // Check Product
    const checkProduct = await productModel.findOne({ name: req.body.name });
    // Check if Product Exist
    if (checkProduct) return next(new Error("Duplicated Product !", { cause: 409 }));
    // Assign Slug
    req.body.slug = slugify(req.body.name);
    // Query
    const product = await productModel.create(req.body)
    // Upload Cover Picture
    if (req.files?.coverPic) {
        const coverFile = req.files.coverPic[0];
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            coverFile.path,
            {
                folder: `${process.env.APP_NAME}/products/${product._id}/cover`,
            }
        );
        product.coverPic = { secure_url, public_id }
    }
    // Upload Product Images
    if (req.files?.productImages) {
        const productImgs = [];
        for (const file of req.files.productImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                file.path,
                {
                    folder: `${process.env.APP_NAME}/products/${product._id}`,
                }
            );
            productImgs.push({ secure_url, public_id });
        }
        product.productImages = productImgs;
    }
    // Query
    await product.save()
    return res.status(201).json({ message: "Product Added", product });
});
export const getAllProducts = asyncHandler(async (req, res, next) => {
    // Create Mongoose Query  
    let modelQuery = productModel.find().populate('Reviews', 'title ratingAverage'); // Virtual Populate
    // 01 pagination
    const { mongooseQuery, page } = queryService.paginateQuery(modelQuery, req.query);
    // 02- filter
    modelQuery = queryService.filterQuery(modelQuery, req.query);
    // 03- Sort
    modelQuery = queryService.sortQuery(modelQuery, req.query)
    // 04- search
    modelQuery = queryService.searchQuery(modelQuery, req.query)
    // 05- Select Fields
    modelQuery = queryService.selectFieldsQuery(modelQuery, req.query)
    // Execute Mongoose Query
    const products = await mongooseQuery;
    return res.status(200).json({ message: "Done", page, products });
});
// Get product By Id
export const getProduct = asyncHandler(async (req, res, next) => {
    // Destructing id From params
    const { id } = req.params;
    // Query
    const product = await productModel.findById(id).populate('Reviews', 'title ratingAverage'); // Virtual Populate
    // Check brand
    if (!product) {
        return next(new Error(`Product Not Found !`, { cause: 404 }))
    }
    // Retrun
    return res.status(200).json({ message: "Done", product })
})
// Update product
export const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let product = await productModel.findById(id);
    if (!product) return next(new Error("product not found!", { cause: 404 }));
    // Check for duplicate product name
    if (req.body.name) {
        const existingProduct = await productModel.findOne({ name: req.body.name });
        if (existingProduct) {
            return next(new Error("Duplicated Product Name!", { cause: 409 }));
        }
        req.body.slug = slugify(req.body.name);
    }
    // Update product details
    product = await productModel.findByIdAndUpdate(id, req.body, { new: true });
    // Update Cover Picture if provided
    if (req.files?.coverPic) {
        await cloudinary.uploader.destroy(product.coverPic?.public_id);
        const coverFile = req.files.coverPic[0];
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            coverFile.path,
            { folder: `${process.env.APP_NAME}/products/${product._id}/cover` }
        );
        product.coverPic = { secure_url, public_id };
    }
    // Update Product Images if provided
    if (req.files?.productImages) {
        for (const img of product.productImages) {
            await cloudinary.uploader.destroy(img?.public_id);
        }
        const productImgs = [];
        for (const file of req.files.productImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
                file.path,
                { folder: `${process.env.APP_NAME}/products/${product._id}` }
            );
            productImgs.push({ secure_url, public_id });
        }
        product.productImages = productImgs;
    }
    await product.save();
    return res.status(200).json({ message: "Product Updated", product });
});

// Delete product
export const deleteProduct = entityService.deleteEntity(
    productModel,
    "Product"
);
// Insert Many Products for One Time Use for test
export const insertManyProducts = asyncHandler(async (req, res, next) => {
    // Destructuring products from request body
    const { products } = req.body;

    // Validate input
    if (!Array.isArray(products) || products.length === 0) {
        return next(
            new Error("Invalid input: products must be a non-empty array", {
                cause: 400,
            })
        );
    }

    // Process products to include slugs and ensure all necessary fields are added
    const productDocs = products.map((product) => ({
        ...product, // Keep all original product properties
        slug: slugify(product.name), // Generate slug dynamically
    }));

    // Insert multiple products
    const insertedProducts = await productModel.insertMany(productDocs, {
        ordered: false,
    });

    return res
        .status(201)
        .json({
            message: "Products Added Successfully",
            products: insertedProducts,
        });
});
