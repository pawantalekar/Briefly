import Joi from 'joi';

export const createLikeSchema = Joi.object({
    blog_id: Joi.string().uuid().required().messages({
        'string.guid': 'Invalid blog ID',
        'any.required': 'Blog ID is required',
    }),
});
