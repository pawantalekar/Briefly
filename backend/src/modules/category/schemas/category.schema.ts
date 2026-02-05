import Joi from 'joi';

export const createCategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.min': 'Category name must be at least 2 characters long',
        'string.max': 'Category name cannot exceed 100 characters',
        'any.required': 'Category name is required',
    }),
    description: Joi.string().max(500).optional(),
});

export const updateCategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional(),
}).min(1);
