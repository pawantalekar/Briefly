import { Router } from 'express';
import { categoryController } from './controllers/category.controller';
import { validateSchema } from '../../middlewares/validateSchema';
import { createCategorySchema, updateCategorySchema } from './schemas/category.schema';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/:id', categoryController.getCategoryById.bind(categoryController));

// Protected routes (Admin only - TODO: add admin check)
router.post(
    '/',
    authMiddleware,
    validateSchema(createCategorySchema),
    categoryController.createCategory.bind(categoryController)
);

router.put(
    '/:id',
    authMiddleware,
    validateSchema(updateCategorySchema),
    categoryController.updateCategory.bind(categoryController)
);

router.delete(
    '/:id',
    authMiddleware,
    categoryController.deleteCategory.bind(categoryController)
);

export default router;
