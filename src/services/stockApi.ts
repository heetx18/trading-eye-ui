
// We'll be using the Finnhub API for real-time stock data
// For a fully functioning app, you'd use a proper API key

type StockQuote = {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
};

type StockSymbol = {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
};

type NewsItem = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
};

// Sample mock data for development - replace with actual API calls in production
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
  { symbol: "META", name: "Meta Platforms, Inc." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
];

// Generate realistic mock price data
const generateMockPrice = (basePrice: number) => {
  const change = (Math.random() - 0.5) * basePrice * 0.05;
  return {
    c: basePrice + change,
    d: change,
    dp: (change / basePrice) * 100,
    h: basePrice + Math.abs(change) * 1.5,
    l: basePrice - Math.abs(change) * 1.5,
    o: basePrice - change / 2,
    pc: basePrice,
    t: Date.now(),
  };
};

// Mock price data for each stock
const mockPriceData: Record<string, StockQuote> = {
  "AAPL": generateMockPrice(185.92),
  "MSFT": generateMockPrice(402.56),
  "GOOGL": generateMockPrice(165.12),
  "AMZN": generateMockPrice(178.22),
  "META": generateMockPrice(445.71),
  "TSLA": generateMockPrice(193.57),
  "NVDA": generateMockPrice(819.49),
  "V": generateMockPrice(275.96),
  "JPM": generateMockPrice(183.08),
  "JNJ": generateMockPrice(153.42),
};

// Mock historical price data for charts
const generateMockHistoricalData = (basePrice: number, days: number = 30) => {
  const data = [];
  let price = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some random variation to price
    price = price + (Math.random() - 0.5) * basePrice * 0.02;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: price,
    });
  }
  
  return data;
};

// Mock news data
const mockNews: NewsItem[] = [
  {
    category: "technology",
    datetime: Date.now() - 3600000,
    headline: "Apple Announces New iPhone Model with Revolutionary Features",
    id: 1,
    image: "https://via.placeholder.com/640x360",
    related: "AAPL",
    source: "Financial Times",
    summary: "Apple Inc. has unveiled its latest iPhone with groundbreaking features including enhanced AI capabilities and improved battery life.",
    url: "#",
  },
  {
    category: "technology",
    datetime: Date.now() - 7200000,
    headline: "Microsoft Cloud Services Revenue Exceeds Expectations",
    id: 2,
    image: "https://via.placeholder.com/640x360",
    related: "MSFT",
    source: "Wall Street Journal",
    summary: "Microsoft reported quarterly earnings that beat analyst estimates, driven primarily by strong growth in its Azure cloud computing services.",
    url: "#",
  },
  {
    category: "automotive",
    datetime: Date.now() - 10800000,
    headline: "Tesla Expands Production Capacity with New Gigafactory",
    id: 3,
    image: "https://via.placeholder.com/640x360",
    related: "TSLA",
    source: "Reuters",
    summary: "Tesla announced plans to build a new Gigafactory in Asia to meet growing demand for electric vehicles in the region.",
    url: "#",
  },
  {
    category: "technology",
    datetime: Date.now() - 14400000,
    headline: "NVIDIA Reports Record Gaming and Data Center Revenue",
    id: 4,
    image: "https://via.placeholder.com/640x360",
    related: "NVDA",
    source: "Bloomberg",
    summary: "NVIDIA corporation announced record-breaking quarterly results, with substantial growth in both gaming and data center segments.",
    url: "#",
  },
];

// API functions
export const stockApi = {
  getStockSymbols: async (): Promise<StockSymbol[]> => {
    // In a real app, you'd fetch from an endpoint
    return mockStocks.map(stock => ({
      description: stock.name,
      displaySymbol: stock.symbol,
      symbol: stock.symbol,
      type: "Common Stock"
    }));
  },
  
  getQuote: async (symbol: string): Promise<StockQuote> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data or generate random if not found
    return mockPriceData[symbol] || generateMockPrice(100);
  },

  getHistoricalData: async (symbol: string): Promise<{ date: string, value: number }[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const basePrice = mockPriceData[symbol]?.c || 100;
    return generateMockHistoricalData(basePrice);
  },
  
  getNews: async (): Promise<NewsItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockNews;
  },

  searchSymbols: async (query: string): Promise<StockSymbol[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockStocks
      .filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
        stock.name.toLowerCase().includes(query.toLowerCase())
      )
      .map(stock => ({
        description: stock.name,
        displaySymbol: stock.symbol,
        symbol: stock.symbol,
        type: "Common Stock"
      }));
  }
};

// WebSocket simulation for real-time updates
export class StockWebSocket {
  private callbacks: ((data: StockQuote & { symbol: string }) => void)[] = [];
  private interval: NodeJS.Timeout | null = null;
  private watchlist: string[] = [];

  constructor() {}

  connect() {
    // Simulate WebSocket connection with an interval
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.watchlist.forEach(symbol => {
          const currentPrice = mockPriceData[symbol]?.c || 100;
          
          // Update the mock data
          const change = (Math.random() - 0.5) * currentPrice * 0.01;
          const newPrice = currentPrice + change;
          
          mockPriceData[symbol] = {
            c: newPrice,
            d: newPrice - mockPriceData[symbol]?.pc || change,
            dp: ((newPrice / mockPriceData[symbol]?.pc - 1) || change / 100) * 100,
            h: Math.max(mockPriceData[symbol]?.h || 0, newPrice),
            l: Math.min(mockPriceData[symbol]?.l || Infinity, newPrice),
            o: mockPriceData[symbol]?.o || (newPrice - change),
            pc: mockPriceData[symbol]?.pc || (newPrice - change),
            t: Date.now(),
          };
          
          // Notify subscribers
          this.callbacks.forEach(callback => 
            callback({...mockPriceData[symbol], symbol})
          );
        });
      }, 3000);
    }
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  subscribe(symbol: string) {
    if (!this.watchlist.includes(symbol)) {
      this.watchlist.push(symbol);
    }
  }

  unsubscribe(symbol: string) {
    this.watchlist = this.watchlist.filter(s => s !== symbol);
  }

  onMessage(callback: (data: StockQuote & { symbol: string }) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }
}
