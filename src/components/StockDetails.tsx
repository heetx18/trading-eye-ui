
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type StockDetailsProps = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
};

const StockDetails = ({
  symbol,
  price,
  change,
  changePercent,
  high,
  low,
  open,
  prevClose,
}: StockDetailsProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold">${price.toFixed(2)}</div>
            <div className={`text-lg ${isPositive ? 'text-stock-up' : 'text-stock-down'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="font-medium">${open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Previous Close</p>
              <p className="font-medium">${prevClose.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Day's High</p>
              <p className="font-medium">${high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Day's Low</p>
              <p className="font-medium">${low.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockDetails;
