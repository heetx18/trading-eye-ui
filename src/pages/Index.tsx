
import React from 'react';
import { StockProvider } from '../contexts/StockContext';
import { useStock } from '../contexts/StockContext';
import Header from '../components/Header';
import Watchlist from '../components/Watchlist';
import StockChart from '../components/StockChart';
import StockDetails from '../components/StockDetails';
import NewsSection from '../components/NewsSection';

const Dashboard = () => {
  const { selectedStock, quotes } = useStock();
  
  const selectedQuote = selectedStock ? quotes[selectedStock] : null;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Watchlist />
              {selectedStock && selectedQuote && (
                <StockDetails
                  symbol={selectedStock}
                  price={selectedQuote.c}
                  change={selectedQuote.d}
                  changePercent={selectedQuote.dp}
                  high={selectedQuote.h}
                  low={selectedQuote.l}
                  open={selectedQuote.o}
                  prevClose={selectedQuote.pc}
                />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            {selectedStock ? (
              <StockChart symbol={selectedStock} />
            ) : (
              <div className="bg-accent p-8 rounded-lg text-center">
                <p className="text-lg">Select a stock from your watchlist to view details</p>
              </div>
            )}
            
            <NewsSection />
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardWrapper = () => (
  <StockProvider>
    <Dashboard />
  </StockProvider>
);

export default DashboardWrapper;
