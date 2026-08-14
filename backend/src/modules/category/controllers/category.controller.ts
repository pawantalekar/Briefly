import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../domain/category.dto';
import { logger } from '../../../shared/utils/logger';

export class CategoryController {
    async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: CreateCategoryDTO = req.body;
            logger.info(`[CATEGORY] Create category - name="${dto.name}"`);
            const category = await categoryService.createCategory(dto);
            logger.info(`[CATEGORY] Category created - categoryId=${category.id} slug=${category.slug}`);
            res.status(201).json({ success: true, message: 'Category created successfully', data: category });
        } catch (error: any) {
            logger.error(`[CATEGORY] Create category failed - ${error.message}`);
            next(error);
        }
    }

    async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info(`[CATEGORY] Get all categories`);
            const categories = await categoryService.getAllCategories();
            logger.info(`[CATEGORY] Fetched ${categories.length} categories`);
            res.status(200).json({ success: true, data: categories });
        } catch (error: any) {
            logger.error(`[CATEGORY] Get all categories failed - ${error.message}`);
            next(error);
        }
    }

    async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            logger.info(`[CATEGORY] Get category - categoryId=${id}`);
            const category = await categoryService.getCategoryById(id as string);
            if (!category) {
                logger.warn(`[CATEGORY] Category not found - categoryId=${id}`);
                res.status(404).json({ success: false, message: 'Category not found' });
                return;
            }
            res.status(200).json({ success: true, data: category });
        } catch (error: any) {
            logger.error(`[CATEGORY] Get category failed - categoryId=${req.params.id} - ${error.message}`);
            next(error);
        }
    }

    async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const dto: UpdateCategoryDTO = req.body;
            logger.info(`[CATEGORY] Update category - categoryId=${id}`);
            const category = await categoryService.updateCategory(id as string, dto);
            logger.info(`[CATEGORY] Category updated - categoryId=${id}`);
            res.status(200).json({ success: true, message: 'Category updated successfully', data: category });
        } catch (error: any) {
            logger.error(`[CATEGORY] Update category failed - categoryId=${req.params.id} - ${error.message}`);
            next(error);
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            logger.info(`[CATEGORY] Delete category - categoryId=${id}`);
            await categoryService.deleteCategory(id as string);
            logger.info(`[CATEGORY] Category deleted - categoryId=${id}`);
            res.status(200).json({ success: true, message: 'Category deleted successfully' });
        } catch (error: any) {
            logger.error(`[CATEGORY] Delete category failed - categoryId=${req.params.id} - ${error.message}`);
            next(error);
        }
    }
}

export const categoryController = new CategoryController();
