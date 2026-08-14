import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../shared/utils/logger';

export const validateSchema = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const fields = error.details.map((e) => e.message).join(', ');
            logger.warn(`[400] ${req.method} ${req.path} - Validation failed: ${fields}`);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map((err) => err.message),
            });
        }

        next();
    };
};
