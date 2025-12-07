import { useState, useEffect } from 'react';
import { Bell, X, TrendingDown, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

interface PriceAlert {
  id: number;
  product_id: number;
  name: string;
  price: number;
  target_price: number;
  image: string;
  notified: boolean;
}

export function PriceAlertManager({ userId }: { userId: number }) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userId) loadAlerts();
  }, [userId]);

  const loadAlerts = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/track/price-alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAlerts(data);
    } catch (error) {
      console.error('Failed to load alerts');
    }
  };

  const createAlert = async (productId: number, targetPrice: number) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/track/price-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId, target_price: targetPrice })
      });
      toast.success('Price alert created!');
      loadAlerts();
    } catch (error) {
      toast.error('Failed to create alert');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="w-4 h-4 mr-2" />
          Price Alerts
          {alerts.length > 0 && (
            <Badge className="ml-2 bg-red-600">{alerts.length}</Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Price Alerts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No price alerts set</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} className="p-4">
                <div className="flex gap-4">
                  <img src={alert.image || '/placeholder.png'} alt={alert.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{alert.name}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current: </span>
                        <span className="font-bold">${alert.price}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Target: </span>
                        <span className="font-bold text-green-600">${alert.target_price}</span>
                      </div>
                    </div>
                    {alert.price <= alert.target_price && (
                      <Badge className="mt-2 bg-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        Price Reached!
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
