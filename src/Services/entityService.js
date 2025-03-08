import slugify from "slugify";
import { asyncHandler } from "../Utils/errorHandling.js";
// Create Entity
export const createEntity = (model, entityName) => {
    return asyncHandler(async (req, res, next) => {
        // Assign Slug to the req.body
        if (req.body.name) {
            req.body.slug = slugify(req.body.name)
        }
        // Check File
        if (!req.file) {
            return next(new Error('File Is Reuired !', { cause: 400 }));
        }
        // Assign file
        req.body.image = req.file.filename
        // Query
        const entity = await model.findOne({ name: req.body.name });
        // Check if brand Exist 
        if (entity) {
            return next(new Error(`Duplicated ${entityName} !`, { cause: 409 }));
        }
        const newEntity = await model.create(req.body);
        return res.status(201).json({ message: `${entityName} Added`, [entityName]: newEntity });
    })
}
// Update Entity
export const updateEntity = (model, entityName) => {
    return asyncHandler(async (req, res, next) => {
        // Destructing id From params
        const { id } = req.params;
        // Assign Slug to the req.body
        if (req.body.name) {
            req.body.slug = slugify(req.body.name)
        }
        // Assign file to image
        if (req.file) {
            req.body.image = req.file.filename
        } else {
            delete req.body.image; // Prevent image from being set to empty
        }
        // Update Query
        const entity = await model.findByIdAndUpdate(id, req.body, { new: true })
        // Check entity
        !entity && next(new Error(`${entityName} Not Found !`, { cause: 404 }))
        // 
        entity && res.status(200).json({ message: `${entityName} Updated`, [entityName]: entity })
    })
}
// Find Entity By ID
export const findEntity = (model, entityName) => {
    return asyncHandler(async (req, res, next) => {
        // Destructing id From params
        const { id } = req.params;
        // Query
        const entity = await model.findById(id)
        // Check brand
        if (!entity) {
            return next(new Error(`${entityName} Not Found !`, { cause: 404 }))

        }
        // Retrun
        return res.status(200).json({ message: "Done", [entityName]: entity })
    })
}
// Delete Entity
export const deleteEntity = (model, entityName = '') => {
    return asyncHandler(async (req, res, next) => {
        // Destructing id From params
        const { id } = req.params;
        const entity = await model.findByIdAndDelete(id)
        // Check Entity
        if (!entity) {
            return next(new Error(`${entityName} Not Found !`, { cause: 404 }))
        }
        // Success
        return res.status(200).json({ message: `${entityName} Deleted`, [entityName]: entity })
    })
}
// Get All Entities 
export const getAllEntities = (model, entityName) => {
    return asyncHandler(async (req, res, next) => {
        const entity = await model.find({})
        return res.status(200).json({ message: "Done", [entityName]: entity })
    })
}

