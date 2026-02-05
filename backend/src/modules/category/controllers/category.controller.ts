import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../domain/category.dto';
import { logger } from '../../../shared/utils/logger';

export class CategoryController {
    async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: CreateCategoryDTO = req.body;
            const category = await categoryService.createCategory(dto);

            res.status(201).json({
                success: true,
                message: 'Category created successfully',
                data: category,
            });
        } catch (error) {
            logger.error('Error in createCategory controller:', error);
            next(error);
        }
    }

    async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categories = await categoryService.getAllCategories();

            res.status(200).json({
                success: true,
                data: categories,
            });
        } catch (error) {
            logger.error('Error in getAllCategories controller:', error);
            next(error);
        }
    }

    async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const category = await categoryService.getCategoryById(id as string);

            if (!category) {
                res.status(404).json({
                    success: false,
                    message: 'Category not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: category,
            });
        } catch (error) {
            logger.error('Error in getCategoryById controller:', error);
            next(error);
        }
    }

    async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const dto: UpdateCategoryDTO = req.body;

            const category = await categoryService.updateCategory(id as string, dto);

            res.status(200).json({
                success: true,
                message: 'Category updated successfully',
                data: category,
            });
        } catch (error) {
            logger.error('Error in updateCategory controller:', error);
            next(error);
        }
    }

    async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await categoryService.deleteCategory(id as string);

            res.status(200).json({
                success: true,
                message: 'Category deleted successfully',
            });
        } catch (error) {
            logger.error('Error in deleteCategory controller:', error);
            next(error);
        }
    }
}

export const categoryController = new CategoryController();
