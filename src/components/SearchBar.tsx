
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { stockApi } from '../services/stockApi';
import { useStock } from '../contexts/StockContext';

type SearchResult = {
  symbol: string;
  description: string;
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const { addToWatchlist, setSelectedStock } = useStock();

  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const symbols = await stockApi.searchSymbols(query);
        setResults(symbols.map(s => ({
          symbol: s.symbol,
          description: s.description
        })));
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (symbol: string) => {
    setSelectedStock(symbol);
    addToWatchlist(symbol);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search stocks..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            className="pl-8"
          />
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {showResults && (query.trim().length > 0 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card shadow-lg rounded-md border overflow-hidden z-10 max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="p-3 text-center text-sm text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result) => (
                <li
                  key={result.symbol}
                  className="border-b last:border-b-0 cursor-pointer hover:bg-accent p-3"
                  onClick={() => handleResultClick(result.symbol)}
                >
                  <div className="font-medium">{result.symbol}</div>
                  <div className="text-sm text-muted-foreground">{result.description}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
