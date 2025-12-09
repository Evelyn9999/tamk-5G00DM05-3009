import Joi from "joi";

// 1. Define Joi schema for Movie
const movieSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    year: Joi.number().integer().min(1888).max(2100).required()
});

// 2. Middleware function
const validateMovie = (req, res, next) => {
    const { error } = movieSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // Format Joi errors nicely
        const details = error.details.map(d => d.message);
        return res.status(400).json({
            error: "Validation failed",
            details
        });
    }

    // If valid → continue to controller
    next();
};

export default validateMovie;
