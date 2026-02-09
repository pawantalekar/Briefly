import { Request, Response, NextFunction } from 'express';
import { marketService } from '../services/market.service';
import { logger } from '../../../shared/utils/logger';

export class MarketController {
    async getCryptoData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await marketService.getCryptoData();
            res.status(200).json({
                success: true,
                data: data
            });
        } catch (error) {
            logger.error('Error in MarketController getCryptoData:', error);
            next(error);
        }
    }
}

export const marketController = new MarketController();
