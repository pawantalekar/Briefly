import { Router } from 'express';
import { marketController } from './controllers/market.controller';

const router = Router();

router.get('/crypto', marketController.getCryptoData);

export default router;
