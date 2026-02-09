import axios from 'axios';
import { logger } from '../../../shared/utils/logger';

export class MarketService {
    private readonly COINGECKO_API_URL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3/coins/markets';
    private cache: any[] = [];
    private lastFetch: number = 0;
    private readonly CACHE_DURATION = 60 * 1000; // 1 minute

    async getCryptoData(): Promise<any[]> {
        // Return cached data if valid
        if (this.cache.length > 0 && Date.now() - this.lastFetch < this.CACHE_DURATION) {
            return this.cache;
        }

        try {
            const response = await axios.get(this.COINGECKO_API_URL, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 10,
                    page: 1,
                    sparkline: false
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/json'
                }
            });

            this.cache = response.data;
            this.lastFetch = Date.now();
            return response.data;
        } catch (error) {
            logger.error('Error fetching crypto data from CoinGecko:', error);

            // If API fails (rate limit), return stale cache if we have it
            if (this.cache.length > 0) {
                return this.cache;
            }

            return [];
        }
    }
}

export const marketService = new MarketService();
