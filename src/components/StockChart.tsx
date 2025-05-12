
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { stockApi } from '../services/stockApi';

type StockChartProps = {
  symbol: string;
};

const StockChart = ({ symbol }: StockChartProps) => {
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([]);
  const [timeframe, setTimeframe] = useState<'1D'|'1W'|'1M'|'3M'|'1Y'>('1M');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      try {
        const data = await stockApi.getHistoricalData(symbol);
        setChartData(data);
      } catch (error) {
        console.error('Failed to load chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, [symbol, timeframe]);

  // Determine chart color based on price trend (up or down)
  const chartColor = chartData.length > 0 && chartData[0].value < chartData[chartData.length - 1].value
    ? '#22c55e' // green for uptrend
    : '#ef4444'; // red for downtrend

  return (
    <Card className="h-[400px]">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{symbol} Price Chart</CardTitle>
          <Tabs defaultValue="1M" value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
            <TabsList>
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="h-[320px] pt-4">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default StockChart;
