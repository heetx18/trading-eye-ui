
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { stockApi } from '../services/stockApi';

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

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        const newsData = await stockApi.getNews();
        setNews(newsData);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market News</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-auto max-h-[600px]">
        {isLoading ? (
          <div className="text-center py-8">Loading news...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No news available</div>
        ) : (
          news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-accent rounded-lg p-3 transition-colors"
            >
              <div className="flex gap-3">
                {item.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.headline}
                      className="w-20 h-16 object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">{item.headline}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.source} · {formatDate(item.datetime)}</p>
                </div>
              </div>
            </a>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
