import { useState, useEffect } from 'react';
import { MapPin, Navigation, Filter, Store, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

interface NearbyProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  shop_name: string;
  distance: number;
  offers_delivery: boolean;
  latitude: number;
  longitude: number;
}

export function NearbyProducts({ onViewProduct }: { onViewProduct: (product: any) => void }) {
  const [products, setProducts] = useState<NearbyProduct[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(4);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          loadNearbyProducts(location);
        },
        (error) => {
          toast.error('Please enable location access to see nearby products');
          setUserLocation({ lat: -1.9403, lng: 29.8739 });
          loadNearbyProducts({ lat: -1.9403, lng: 29.8739 });
        }
      );
    }
  };

  const loadNearbyProducts = async (location: { lat: number; lng: number }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
        radius: radius.toString(),
        deliveryOnly: deliveryOnly.toString()
      });

      const res = await fetch(`${API_URL}/locations/products/nearby?${params}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load nearby products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation) {
      loadNearbyProducts(userLocation);
    }
  }, [radius, deliveryOnly]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold">Nearby Products</h2>
              <p className="text-sm text-gray-600">Discover products near you</p>
            </div>
          </div>
          <Button onClick={getUserLocation} variant="outline">
            <Navigation className="w-4 h-4 mr-2" />
            Update Location
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Search Radius (km)</label>
            <Select value={radius.toString()} onValueChange={(v) => setRadius(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 km</SelectItem>
                <SelectItem value="2">2 km</SelectItem>
                <SelectItem value="4">4 km</SelectItem>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="20">20 km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={deliveryOnly}
                onChange={(e) => setDeliveryOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Delivery Available Only</span>
            </label>
          </div>
        </div>

        {userLocation && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-blue-800">
              📍 Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          </div>
        )}
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding nearby products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onViewProduct(product)}>
              <div className="relative">
                <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full h-48 object-cover" />
                <Badge className="absolute top-2 right-2 bg-blue-600">
                  {product.distance.toFixed(1)} km
                </Badge>
                {product.offers_delivery && (
                  <Badge className="absolute top-2 left-2 bg-green-600">
                    Delivery Available
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Store className="w-4 h-4" />
                  <span>{product.shop_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No products found nearby</h3>
          <p className="text-gray-600 mb-4">Try increasing the search radius or disable delivery filter</p>
          <Button onClick={() => setRadius(10)}>Increase Radius to 10km</Button>
        </Card>
      )}
    </div>
  );
}
