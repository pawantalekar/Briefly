import { Router } from 'express';
import { tagController } from './controllers/tag.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', tagController.getAllTags.bind(tagController));
router.post('/', authMiddleware, tagController.createTag.bind(tagController));

export default router;
