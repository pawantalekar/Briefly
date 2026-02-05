import { Router } from 'express';
import { commentController } from './controllers/comment.controller';
import { validateSchema } from '../../middlewares/validateSchema';
import { createCommentSchema, updateCommentSchema } from './schemas/comment.schema';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/blog/:blogId', commentController.getCommentsByBlogId.bind(commentController));

// Protected routes
router.post(
    '/',
    authMiddleware,
    validateSchema(createCommentSchema),
    commentController.createComment.bind(commentController)
);

router.put(
    '/:id',
    authMiddleware,
    validateSchema(updateCommentSchema),
    commentController.updateComment.bind(commentController)
);

router.delete(
    '/:id',
    authMiddleware,
    commentController.deleteComment.bind(commentController)
);

export default router;
