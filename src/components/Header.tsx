
import React from 'react';
import SearchBar from './SearchBar';
import { ChartLine, DollarSign } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <ChartLine size={28} className="text-primary" />
        <h1 className="text-2xl font-bold">TradingEye</h1>
      </div>
      
      <div className="w-full md:w-auto md:min-w-[300px]">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
