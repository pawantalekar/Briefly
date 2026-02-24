import axios from 'axios';
import { logger } from '../../../shared/utils/logger';

const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'];

const STOCK_NAMES: Record<string, string> = {
    AAPL: 'Apple Inc.',
    GOOGL: 'Alphabet Inc.',
    MSFT: 'Microsoft Corp.',
    AMZN: 'Amazon.com Inc.',
    TSLA: 'Tesla Inc.',
    META: 'Meta Platforms',
    NVDA: 'NVIDIA Corp.',
    NFLX: 'Netflix Inc.',
    AMD: 'AMD Inc.',
    INTC: 'Intel Corp.',
};

export class MarketService {
    private readonly COINGECKO_API_URL = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3/coins/markets';
    private readonly FINNHUB_API_URL = 'https://finnhub.io/api/v1/quote';
    private readonly CACHE_DURATION = 60 * 1000;

    private cryptoCache: any[] = [];
    private cryptoLastFetch: number = 0;

    private stockCache: any[] = [];
    private stockLastFetch: number = 0;

    async getCryptoData(): Promise<any[]> {
        if (this.cryptoCache.length > 0 && Date.now() - this.cryptoLastFetch < this.CACHE_DURATION) {
            return this.cryptoCache;
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

            this.cryptoCache = response.data;
            this.cryptoLastFetch = Date.now();
            return response.data;
        } catch (error) {
            logger.error('Error fetching crypto data from CoinGecko:', error);
            if (this.cryptoCache.length > 0) return this.cryptoCache;
            return [];
        }
    }

    async getStockData(): Promise<any[]> {
        if (this.stockCache.length > 0 && Date.now() - this.stockLastFetch < this.CACHE_DURATION) {
            return this.stockCache;
        }

        const apiKey = process.env.FINNHUB_API_KEY;
        if (!apiKey) {
            logger.warn('FINNHUB_API_KEY not set. Returning cached or empty stock data.');
            return this.stockCache.length > 0 ? this.stockCache : [];
        }

        try {
            const stockPromises = STOCK_SYMBOLS.map(async (symbol) => {
                const response = await axios.get(this.FINNHUB_API_URL, {
                    params: { symbol, token: apiKey }
                });
                const data = response.data;
                return {
                    symbol,
                    name: STOCK_NAMES[symbol] || symbol,
                    price: data.c || 0,
                    change: data.d || 0,
                    changePercent: data.dp || 0,
                };
            });

            const results = await Promise.all(stockPromises);
            const valid = results.filter(s => s.price > 0);

            if (valid.length > 0) {
                this.stockCache = valid;
                this.stockLastFetch = Date.now();
            }

            return this.stockCache.length > 0 ? this.stockCache : results;
        } catch (error) {
            logger.error('Error fetching stock data from Finnhub:', error);
            return this.stockCache.length > 0 ? this.stockCache : [];
        }
    }
}

export const marketService = new MarketService();
