import axios from 'axios';
import { logger } from '../../../shared/utils/logger';

export class MarketService {
    private readonly COINGECKO_API_URL = process.env.COINGECKO_API_URL || '';

    async getCryptoData(): Promise<any[]> {
        try {
            const response = await axios.get(this.COINGECKO_API_URL, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 10,
                    page: 1,
                    sparkline: false
                }
            });

            return response.data;
        } catch (error) {
            logger.error('Error fetching crypto data from CoinGecko:', error);
            return [];
        }
    }
}

export const marketService = new MarketService();
