import { useEffect, useState } from 'react';
import { marketService } from '../../services/api';

interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

const FALLBACK_STOCKS: StockData[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.25, change: 2.35, changePercent: 1.34 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: -1.20, changePercent: -0.83 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 420.15, change: 5.40, changePercent: 1.30 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 175.60, change: 3.25, changePercent: 1.89 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 235.90, change: -4.10, changePercent: -1.71 },
    { symbol: 'META', name: 'Meta Platforms', price: 485.30, change: 8.50, changePercent: 1.78 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 720.45, change: 12.30, changePercent: 1.74 },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 625.80, change: -2.40, changePercent: -0.38 },
];

const StockTicker = () => {
    const [stocks, setStocks] = useState<StockData[]>(FALLBACK_STOCKS);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const data = await marketService.getStockData();
                if (Array.isArray(data) && data.length > 0) {
                    setStocks(data);
                }
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        const initialFetch = setTimeout(fetchStocks, 100);
        const interval = setInterval(fetchStocks, 60000);

        return () => {
            clearTimeout(initialFetch);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="bg-black text-white py-2 overflow-hidden border-b border-gray-800 z-40 relative">
            <div className="ticker-wrapper">
                <div className="ticker-content">
                    {[...stocks, ...stocks].map((stock, index) => (
                        <div key={`${stock.symbol}-${index}`} className="inline-flex items-center mx-6">
                            <span className="font-semibold text-gray-300 mr-2">{stock.symbol}</span>
                            <span className="text-white mr-2">${stock.price.toFixed(2)}</span>
                            <span className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .ticker-wrapper {
                    width: 100%;
                    overflow: hidden;
                }

                .ticker-content {
                    display: inline-block;
                    white-space: nowrap;
                    animation: ticker 30s linear infinite;
                }

                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .ticker-content:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default StockTicker;
