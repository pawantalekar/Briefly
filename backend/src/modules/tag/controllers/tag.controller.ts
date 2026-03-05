import { Request, Response, NextFunction } from 'express';
import { tagService } from '../services/tag.service';
import { logger } from '../../../shared/utils/logger';

export class TagController {
    async createTag(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name } = req.body;
            if (!name || typeof name !== 'string' || !name.trim()) {
                res.status(400).json({ success: false, message: 'Tag name is required' });
                return;
            }
            const tag = await tagService.createTag(name);
            res.status(201).json({ success: true, data: tag });
        } catch (error) {
            logger.error('Error in createTag controller:', error);
            next(error);
        }
    }

    async getAllTags(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tags = await tagService.getAllTags();
            res.status(200).json({
                success: true,
                data: tags,
                count: tags.length,
            });
        } catch (error) {
            logger.error('Error in getAllTags controller:', error);
            next(error);
        }
    }
}

export const tagController = new TagController();
