import Joi from 'joi';

// Schema for registration
const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(32)
        .required(),
    password: Joi.string()
        .min(6)
        .max(128)
        .required(),
    // optional role: only 'user' or 'admin' if provided
    role: Joi.string()
        .valid('user', 'admin')
        .optional()
});

// Schema for login
const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

// Middleware: validate body for /auth/register
export const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// Middleware: validate body for /auth/login
export const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
