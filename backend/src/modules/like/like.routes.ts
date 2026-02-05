import { Router } from 'express';
import { likeController } from './controllers/like.controller';
import { validateSchema } from '../../middlewares/validateSchema';
import { createLikeSchema } from './schemas/like.schema';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/stats/:blogId', likeController.getLikeStats.bind(likeController));

// Protected routes
router.post(
    '/toggle',
    authMiddleware,
    validateSchema(createLikeSchema),
    likeController.toggleLike.bind(likeController)
);

export default router;
