import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

interface LocationData {
  country: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  latitude: number;
  longitude: number;
  offers_delivery: boolean;
  delivery_radius: number;
}

export function ShopLocationForm({ onSave, initialData }: { onSave: (data: LocationData) => void; initialData?: Partial<LocationData> }) {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState<LocationData>({
    country: 'Rwanda',
    province: '',
    district: '',
    sector: '',
    cell: '',
    latitude: 0,
    longitude: 0,
    offers_delivery: true,
    delivery_radius: 10,
    ...initialData
  });

  useEffect(() => {
    loadProvinces();
  }, [language]);

  useEffect(() => {
    if (formData.province) {
      loadDistricts(formData.province);
    }
  }, [formData.province]);

  const loadProvinces = async () => {
    try {
      const res = await fetch(`${API_URL}/locations/provinces?lang=${language}`);
      const data = await res.json();
      setProvinces(data);
    } catch (error) {
      toast.error('Failed to load provinces');
    }
  };

  const loadDistricts = async (province: string) => {
    try {
      const res = await fetch(`${API_URL}/locations/districts/${province}`);
      const data = await res.json();
      setDistricts(data);
    } catch (error) {
      toast.error('Failed to load districts');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          toast.success('Location captured successfully');
        },
        () => {
          toast.error('Failed to get location. Please enable location access.');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.province || !formData.district || !formData.latitude || !formData.longitude) {
      toast.error('Please fill all required fields and capture location');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Shop Location</h3>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="rw">Kinyarwanda</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Country / Igihugu</Label>
        <Input value="Rwanda" disabled />
      </div>

      <div>
        <Label>Province / Intara *</Label>
        <Select value={formData.province} onValueChange={(v) => setFormData({ ...formData, province: v, district: '' })}>
          <SelectTrigger>
            <SelectValue placeholder="Select province / Hitamo intara" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>District / Akarere *</Label>
        <Select value={formData.district} onValueChange={(v) => setFormData({ ...formData, district: v })} disabled={!formData.province}>
          <SelectTrigger>
            <SelectValue placeholder="Select district / Hitamo akarere" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((d) => (
              <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Sector / Umurenge</Label>
        <Input
          value={formData.sector}
          onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
          placeholder="Enter sector / Andika umurenge"
        />
      </div>

      <div>
        <Label>Cell / Akagari</Label>
        <Input
          value={formData.cell}
          onChange={(e) => setFormData({ ...formData, cell: e.target.value })}
          placeholder="Enter cell / Andika akagari"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <Label>GPS Coordinates / Aho uherereye *</Label>
          <Button type="button" onClick={getCurrentLocation} variant="outline" size="sm">
            <Navigation className="w-4 h-4 mr-2" />
            Get Location / Kubika aho uri
          </Button>
        </div>
        {formData.latitude !== 0 && formData.longitude !== 0 ? (
          <div className="text-sm text-green-700">
            ✓ Location captured: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            Click button to capture your shop location / Kanda kugirango ufate aho dukikiro yawe iherereye
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.offers_delivery}
          onChange={(e) => setFormData({ ...formData, offers_delivery: e.target.checked })}
          className="w-4 h-4"
        />
        <Label>Offer Delivery Service / Gutanga serivisi yo gutwarwa</Label>
      </div>

      {formData.offers_delivery && (
        <div>
          <Label>Delivery Radius (km) / Intera yo gutwarwa (km)</Label>
          <Select value={formData.delivery_radius.toString()} onValueChange={(v) => setFormData({ ...formData, delivery_radius: Number(v) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 km</SelectItem>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="15">15 km</SelectItem>
              <SelectItem value="20">20 km</SelectItem>
              <SelectItem value="50">50 km</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" className="w-full">
        Save Location / Bika aho uherereye
      </Button>
    </form>
  );
}
