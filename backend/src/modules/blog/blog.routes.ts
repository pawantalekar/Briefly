import { Router } from 'express';
import { blogController } from './controllers/blog.controller';
import { validateSchema } from '../../middlewares/validateSchema';
import { createBlogSchema, updateBlogSchema } from './schemas/blog.schema';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// Public routes — specific paths MUST come before dynamic /:id
router.get('/search', blogController.searchBlogs.bind(blogController));
router.get('/my/blogs', authMiddleware, blogController.getMyBlogs.bind(blogController));
router.get('/', blogController.getAllBlogs.bind(blogController));
router.get('/slug/:slug', blogController.getBlogBySlug.bind(blogController));
router.get('/:id', blogController.getBlogById.bind(blogController));

// Protected routes (require authentication)
router.post(
    '/',
    authMiddleware,
    validateSchema(createBlogSchema),
    blogController.createBlog.bind(blogController)
);

router.put(
    '/:id',
    authMiddleware,
    validateSchema(updateBlogSchema),
    blogController.updateBlog.bind(blogController)
);

router.delete(
    '/:id',
    authMiddleware,
    blogController.deleteBlog.bind(blogController)
);

export default router;
