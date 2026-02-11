import { categoryDAO } from '../dao/category.dao';
import { CreateCategoryDTO, UpdateCategoryDTO, CategoryResponseDTO } from '../domain/category.dto';
import { generateSlug } from '../../../shared/utils/slugGenerator';
import { logger } from '../../../shared/utils/logger';


export class CategoryService {
    async createCategory(dto: CreateCategoryDTO): Promise<CategoryResponseDTO> {
        try {
            const slug = generateSlug(dto.name);

            const categoryData = {
                name: dto.name,
                slug,
                description: dto.description,
            };

            const category = await categoryDAO.create(categoryData);
            return category as CategoryResponseDTO;
        } catch (error) {
            logger.error('Error in createCategory service:', error);
            throw new Error('Failed to create category');
        }
    }

    async getAllCategories(): Promise<CategoryResponseDTO[]> {
        try {
            const categories = await categoryDAO.findAll();
            return categories as CategoryResponseDTO[];
        } catch (error) {
            logger.error('Error in getAllCategories service:', error);
            throw new Error('Failed to retrieve categories');
        }
    }

    async getCategoryById(id: string): Promise<CategoryResponseDTO | null> {
        try {
            const category = await categoryDAO.findById(id);
            return category as CategoryResponseDTO | null;
        } catch (error) {
            logger.error('Error in getCategoryById service:', error);
            throw new Error('Failed to retrieve category');
        }
    }

    async updateCategory(id: string, dto: UpdateCategoryDTO): Promise<CategoryResponseDTO> {
        try {
            const updateData: any = { ...dto };

            if (dto.name) {
                updateData.slug = generateSlug(dto.name);
            }

            const category = await categoryDAO.update(id, updateData);
            return category as CategoryResponseDTO;
        } catch (error) {
            logger.error('Error in updateCategory service:', error);
            throw new Error('Failed to update category');
        }
    }

    async deleteCategory(id: string): Promise<void> {
        try {
            await categoryDAO.delete(id);
        } catch (error) {
            logger.error('Error in deleteCategory service:', error);
            throw new Error('Failed to delete category');
        }
    }
}

export const categoryService = new CategoryService();
