
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from 'lucide-react';

type StockCardProps = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  onClick?: () => void;
  isSelected?: boolean;
};

const StockCard = ({ 
  symbol, 
  price, 
  change, 
  changePercent, 
  onClick,
  isSelected = false
}: StockCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md
        ${isSelected ? 'border-primary border-2' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">{symbol}</h3>
          </div>
          
          <div className={`flex items-center gap-1 font-medium
            ${isPositive ? 'text-stock-up' : 'text-stock-down'}`}
          >
            {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{changePercent.toFixed(2)}%</span>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="text-2xl font-bold">
            ${price.toFixed(2)}
          </div>
          <div className={`text-sm ${isPositive ? 'text-stock-up' : 'text-stock-down'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
