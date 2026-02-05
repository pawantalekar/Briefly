import { Router } from 'express';
import { adminController } from './controllers/admin.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Stats
router.get('/stats', adminController.getStats);

// User management
router.get('/users', adminController.getAllUsers);
router.delete('/users/:userId', adminController.deleteUser);
router.patch('/users/:userId/role', adminController.updateUserRole);
router.patch('/users/:userId/status', adminController.toggleUserStatus);

// Blog management
router.get('/blogs', adminController.getAllBlogs);
router.delete('/blogs/:blogId', adminController.deleteBlog);
router.patch('/blogs/:blogId/publish', adminController.toggleBlogPublish);

export default router;
