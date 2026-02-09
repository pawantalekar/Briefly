import { useEffect, useMemo, useState } from 'react';

interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
}

const StockTicker = () => {
    const [stocks, setStocks] = useState<StockData[]>([
        { symbol: 'AAPL', name: 'Apple Inc.', price: 178.25, change: 2.35, changePercent: 1.34 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: -1.20, changePercent: -0.83 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 420.15, change: 5.40, changePercent: 1.30 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 175.60, change: 3.25, changePercent: 1.89 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 235.90, change: -4.10, changePercent: -1.71 },
        { symbol: 'META', name: 'Meta Platforms', price: 485.30, change: 8.50, changePercent: 1.78 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 720.45, change: 12.30, changePercent: 1.74 },
        { symbol: 'NFLX', name: 'Netflix Inc.', price: 625.80, change: -2.40, changePercent: -0.38 },
    ]);

    const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

    const symbols = useMemo(() => ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'], []);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const stockPromises = symbols.map(async (symbol) => {
                    const response = await fetch(
                        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
                    );
                    const data = await response.json();

                    return {
                        symbol,
                        name: symbol,
                        price: data.c || 0, // current price
                        change: data.d || 0, // change
                        changePercent: data.dp || 0, // percent change
                    };
                });

                const stockData = await Promise.all(stockPromises);
                const validStocks = stockData.filter(stock => stock.price > 0);
                if (validStocks.length > 0) {
                    setStocks(validStocks);
                }
            } catch (error) {
                console.error('Error fetching stock data:', error);
                // Keep existing data if fetch fails
            }
        };



        const initialFetch = setTimeout(() => {
            fetchStockData();
        }, 100);

        // Update every 60 seconds (free tier limit)
        const interval = setInterval(() => {
            fetchStockData();
        }, 60000);

        return () => {
            clearTimeout(initialFetch);
            clearInterval(interval);
        };
    }, [FINNHUB_API_KEY, symbols]);

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
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .ticker-content:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default StockTicker;
