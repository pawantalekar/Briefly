import { Router } from 'express';
import { marketController } from './controllers/market.controller';

const router = Router();

router.get('/crypto', marketController.getCryptoData);
router.get('/stocks', marketController.getStocks);

export default router;
