import { Request, Response, NextFunction } from 'express';
import { tagService } from '../services/tag.service';
import { logger } from '../../../shared/utils/logger';

export class TagController {
    async createTag(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name } = req.body;
            if (!name || typeof name !== 'string' || !name.trim()) {
                logger.warn(`[TAG] Create tag failed - name is required`);
                res.status(400).json({ success: false, message: 'Tag name is required' });
                return;
            }
            logger.info(`[TAG] Create tag - name="${name}"`);
            const tag = await tagService.createTag(name);
            logger.info(`[TAG] Tag created - tagId=${tag.id} slug=${tag.slug}`);
            res.status(201).json({ success: true, data: tag });
        } catch (error: any) {
            logger.error(`[TAG] Create tag failed - ${error.message}`);
            next(error);
        }
    }

    async getAllTags(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info(`[TAG] Get all tags`);
            const tags = await tagService.getAllTags();
            logger.info(`[TAG] Fetched ${tags.length} tags`);
            res.status(200).json({ success: true, data: tags, count: tags.length });
        } catch (error: any) {
            logger.error(`[TAG] Get all tags failed - ${error.message}`);
            next(error);
        }
    }
}

export const tagController = new TagController();
