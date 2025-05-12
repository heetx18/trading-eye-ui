
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { stockApi, StockWebSocket } from '../services/stockApi';

type StockQuote = {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
  symbol: string;
};

type StockContextType = {
  watchlist: string[];
  quotes: Record<string, StockQuote>;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  selectedStock: string | null;
  setSelectedStock: (symbol: string | null) => void;
  isLoading: boolean;
};

const StockContext = createContext<StockContextType | undefined>(undefined);

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};

type StockProviderProps = {
  children: ReactNode;
};

export const StockProvider = ({ children }: StockProviderProps) => {
  const [watchlist, setWatchlist] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL', 'AMZN']);
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [selectedStock, setSelectedStock] = useState<string | null>('AAPL');
  const [isLoading, setIsLoading] = useState(true);
  const [websocket] = useState(() => new StockWebSocket());

  useEffect(() => {
    // Load initial quotes
    const loadInitialData = async () => {
      setIsLoading(true);
      
      try {
        const quotePromises = watchlist.map(async (symbol) => {
          const quote = await stockApi.getQuote(symbol);
          return { symbol, quote };
        });
        
        const results = await Promise.all(quotePromises);
        
        const newQuotes: Record<string, StockQuote> = {};
        results.forEach(({ symbol, quote }) => {
          newQuotes[symbol] = { ...quote, symbol };
        });
        
        setQuotes(newQuotes);
      } catch (error) {
        console.error("Failed to load initial stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
    
    return () => {};
  }, []);

  useEffect(() => {
    // Setup WebSocket for real-time updates
    websocket.connect();
    
    // Subscribe to watchlist items
    watchlist.forEach(symbol => {
      websocket.subscribe(symbol);
    });
    
    // Handle incoming data
    const unsubscribe = websocket.onMessage((data) => {
      setQuotes(prev => ({
        ...prev,
        [data.symbol]: data
      }));
    });
    
    return () => {
      unsubscribe();
      websocket.disconnect();
    };
  }, [watchlist, websocket]);

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      const newWatchlist = [...watchlist, symbol];
      setWatchlist(newWatchlist);
      
      // Subscribe to updates for the new symbol
      websocket.subscribe(symbol);
      
      // Fetch initial quote for the new symbol
      stockApi.getQuote(symbol).then(quote => {
        setQuotes(prev => ({
          ...prev,
          [symbol]: { ...quote, symbol }
        }));
      });
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
    websocket.unsubscribe(symbol);
  };

  return (
    <StockContext.Provider
      value={{
        watchlist,
        quotes,
        addToWatchlist,
        removeFromWatchlist,
        selectedStock,
        setSelectedStock,
        isLoading
      }}
    >
      {children}
    </StockContext.Provider>
  );
};
