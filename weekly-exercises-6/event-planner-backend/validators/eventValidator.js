import Joi from 'joi';

export const eventSchema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    date: Joi.date().iso().required(), // expects ISO string
    location: Joi.string().min(1).max(200).required(),
    type: Joi.string().valid('meeting', 'birthday', 'exam', 'other').required()
});

export const validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
