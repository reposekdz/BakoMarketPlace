import { useState, useEffect } from 'react';
import { X, Play, ExternalLink, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const API_URL = 'http://localhost:5000/api';

interface Ad {
  id: number;
  title: string;
  description: string;
  image_url: string;
  video_url?: string;
  link_url?: string;
  ad_type: string;
  sponsor_name: string;
  sponsor_logo?: string;
}

export function AdvancedAdsManager({ placement }: { placement: string }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    loadAds();
    loadLocalAds();
  }, [placement]);

  useEffect(() => {
    if (ads.length > 0 && ads[currentAdIndex]) {
      trackImpression(ads[currentAdIndex].id);
    }
  }, [currentAdIndex, ads]);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const loadAds = async () => {
    try {
      const res = await fetch(`${API_URL}/ads?placement=${placement}`);
      const data = await res.json();
      setAds(data);
    } catch (error) {
      console.error('Failed to load ads');
    }
  };

  const loadLocalAds = () => {
    try {
      const localAds = JSON.parse(localStorage.getItem('localAds') || '[]');
      const filteredAds = localAds.filter((ad: any) => ad.placement === placement && ad.status === 'active');
      setAds(prev => [...prev, ...filteredAds]);
    } catch (error) {
      console.error('Failed to load local ads');
    }
  };

  const trackImpression = async (adId: number) => {
    try {
      await fetch(`${API_URL}/ads/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad_id: adId,
          interaction_type: 'impression',
          device_type: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          browser: navigator.userAgent.split(' ').pop()
        })
      });
    } catch (error) {
      console.error('Failed to track impression');
    }
  };

  const trackClick = async (ad: Ad) => {
    try {
      await fetch(`${API_URL}/ads/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad_id: ad.id,
          interaction_type: 'click',
          device_type: /Mobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          browser: navigator.userAgent.split(' ').pop()
        })
      });
      
      if (ad.link_url) {
        window.open(ad.link_url, '_blank');
      }
    } catch (error) {
      console.error('Failed to track click');
    }
  };

  if (!isVisible || ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  if (placement === 'home_top') {
    return (
      <Card className="relative overflow-hidden mb-6 group cursor-pointer" onClick={() => trackClick(currentAd)}>
        <div className="relative h-48 md:h-64">
          {currentAd.video_url ? (
            <video src={currentAd.video_url} autoPlay muted loop className="w-full h-full object-cover" />
          ) : (
            <img src={currentAd.image_url} alt={currentAd.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              {currentAd.sponsor_logo && (
                <img src={currentAd.sponsor_logo} alt={currentAd.sponsor_name} className="w-8 h-8 rounded-full bg-white" />
              )}
              <Badge className="bg-white/20 backdrop-blur">Sponsored</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-2">{currentAd.title}</h3>
            <p className="text-sm opacity-90">{currentAd.description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {ads.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {ads.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${idx === currentAdIndex ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        )}
      </Card>
    );
  }

  if (placement === 'home_sidebar') {
    return (
      <Card className="overflow-hidden mb-4 cursor-pointer group" onClick={() => trackClick(currentAd)}>
        <div className="relative">
          <img src={currentAd.image_url} alt={currentAd.title} className="w-full h-48 object-cover" />
          <Badge className="absolute top-2 left-2 bg-blue-600">Sponsored</Badge>
        </div>
        <div className="p-4">
          <h4 className="font-semibold mb-2">{currentAd.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{currentAd.description}</p>
          <Button size="sm" className="w-full">
            Learn More <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </Card>
    );
  }

  return null;
}
