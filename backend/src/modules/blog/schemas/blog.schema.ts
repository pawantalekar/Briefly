import Joi from 'joi';

export const createBlogSchema = Joi.object({
    title: Joi.string().min(5).max(200).required().messages({
        'string.min': 'Title must be at least 5 characters long',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required',
    }),
    content: Joi.string().min(50).required().messages({
        'string.min': 'Content must be at least 50 characters long',
        'any.required': 'Content is required',
    }),
    excerpt: Joi.string().max(500).optional(),
    cover_image: Joi.string().uri().optional(),
    category_id: Joi.string().uuid().required().messages({
        'string.guid': 'Invalid category ID',
        'any.required': 'Category ID is required',
    }),
    tags: Joi.array().items(Joi.string().uuid()).optional(),
    is_published: Joi.boolean().optional().default(false),
    position: Joi.string().valid('featured', 'top', 'standard').default('standard'),
});

export const updateBlogSchema = Joi.object({
    title: Joi.string().min(5).max(200).optional(),
    content: Joi.string().min(50).optional(),
    excerpt: Joi.string().max(500).optional(),
    cover_image: Joi.string().uri().optional(),
    category_id: Joi.string().uuid().optional(),
    tags: Joi.array().items(Joi.string().uuid()).optional(),
    is_published: Joi.boolean().optional(),
    position: Joi.string().valid('featured', 'top', 'standard').optional(),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});
