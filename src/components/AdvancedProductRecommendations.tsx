import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Eye, ShoppingBag } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const API_URL = 'http://localhost:5000/api';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  score: number;
}

export function AdvancedProductRecommendations({ userId, onViewProduct }: any) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    try {
      const res = await fetch(`${API_URL}/track/recommendations/${userId}`);
      const data = await res.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (recommendations.length === 0) return null;

  return (
    <div className="my-8">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Recommended For You</h2>
        <Badge variant="secondary">AI Powered</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {recommendations.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => onViewProduct(product)}
          >
            <div className="relative">
              <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full h-40 object-cover" />
              <Badge className="absolute top-2 right-2 bg-purple-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                {Math.round(product.score)}%
              </Badge>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-purple-600">${product.price}</span>
                <Button size="sm" variant="ghost">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
