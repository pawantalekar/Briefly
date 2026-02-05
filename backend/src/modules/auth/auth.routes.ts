import { Router } from 'express';
import { authController } from './controllers/auth.controller';
import { validateSchema } from '../../middlewares/validateSchema';
import { registerSchema, loginSchema } from './schemas/auth.schema';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// Public routes
router.post(
    '/register',
    validateSchema(registerSchema),
    authController.register.bind(authController)
);

router.post(
    '/login',
    validateSchema(loginSchema),
    authController.login.bind(authController)
);

// Protected routes
router.get(
    '/profile',
    authMiddleware,
    authController.getProfile.bind(authController)
);

router.post(
    '/logout',
    authMiddleware,
    authController.logout.bind(authController)
);

export default router;
