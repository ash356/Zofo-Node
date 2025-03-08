import joi from "joi";

export const generalFields = {
    id: joi.string().required().min(24).max(24).required(),
    userName: joi.string().alphanum().min(3).max(11).required(),
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 3,
        tlds: { allow: ["com", "net", "edu"] },
    }).required(),
    password: joi
        .string()
        .pattern(new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-zA-Z\d]).{8,15}$/)).required(),
    cPassword: joi.string().required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required(),
    }),
    phone: joi.string().pattern(new RegExp(/^(\+2|002)?01[0125]\d{8}$/)),
    quantity: joi.number().positive().integer().min(1).required()
};
// Validation Middleware

export const validation = (schema) => {
    return (req, res, next) => {
        const inputData = { ...req.body, ...req.query, ...req.params };
        if (req.file || req.files) {
            inputData.file = req.file || req.files;
        }
        const validationResult = schema.validate(inputData, { abortEarly: false });
        if (validationResult.error?.details) {
            return res.status(400).json({
                message: "Validation Error !",
                ValidationError: validationResult.error.details,
            });
        }
        return next();
    };
};
