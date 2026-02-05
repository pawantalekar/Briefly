import Joi from 'joi';

export const createCommentSchema = Joi.object({
    content: Joi.string().min(1).max(1000).required().messages({
        'string.min': 'Comment cannot be empty',
        'string.max': 'Comment cannot exceed 1000 characters',
        'any.required': 'Comment content is required',
    }),
    blog_id: Joi.string().uuid().required().messages({
        'string.guid': 'Invalid blog ID',
        'any.required': 'Blog ID is required',
    }),
    parent_id: Joi.string().uuid().optional(),
});

export const updateCommentSchema = Joi.object({
    content: Joi.string().min(1).max(1000).required().messages({
        'string.min': 'Comment cannot be empty',
        'string.max': 'Comment cannot exceed 1000 characters',
        'any.required': 'Comment content is required',
    }),
});
