
import React from 'react';
import { useStock } from '../contexts/StockContext';
import StockCard from './StockCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const Watchlist = () => {
  const { watchlist, quotes, removeFromWatchlist, selectedStock, setSelectedStock } = useStock();

  const handleSelect = (symbol: string) => {
    setSelectedStock(symbol);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {watchlist.length === 0 ? (
          <p className="text-center text-muted-foreground p-4">
            Your watchlist is empty. Use the search bar to add stocks.
          </p>
        ) : (
          watchlist.map(symbol => {
            const quote = quotes[symbol];
            
            if (!quote) return null;
            
            return (
              <div key={symbol} className="relative group">
                <StockCard
                  symbol={symbol}
                  price={quote.c}
                  change={quote.d}
                  changePercent={quote.dp}
                  onClick={() => handleSelect(symbol)}
                  isSelected={selectedStock === symbol}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(symbol);
                    if (selectedStock === symbol) {
                      const newSelected = watchlist.find(s => s !== symbol);
                      if (newSelected) setSelectedStock(newSelected);
                      else setSelectedStock(null);
                    }
                  }}
                >
                  <X size={16} />
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default Watchlist;
