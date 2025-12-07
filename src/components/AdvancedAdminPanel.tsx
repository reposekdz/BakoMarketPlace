import { useState, useEffect } from 'react';
import { Upload, Video, Image, Link, DollarSign, Calendar, Target, TrendingUp, Users, Eye, MousePointer, Trash2, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function AdvancedAdminPanel() {
  const [ads, setAds] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '', description: '', ad_type: 'banner', placement: 'home_top',
    sponsor_name: '', link_url: '', budget: 0, start_date: '', end_date: ''
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState('');

  useEffect(() => {
    loadAds();
    loadLocalAds();
  }, []);

  const loadAds = async () => {
    const res = await fetch('http://localhost:5000/api/ads/admin');
    if (res.ok) {
      const data = await res.json();
      setAds(data);
    }
  };

  const loadLocalAds = () => {
    const localAds = JSON.parse(localStorage.getItem('localAds') || '[]');
    setAds(prev => [...prev, ...localAds]);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
        localStorage.setItem(`ad_media_${Date.now()}`, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const adData = {
      ...formData,
      image_url: mediaPreview,
      video_url: formData.ad_type === 'video' ? mediaPreview : null,
      impressions: 0,
      clicks: 0,
      status: 'active'
    };

    // Save to localStorage
    const localAds = JSON.parse(localStorage.getItem('localAds') || '[]');
    localAds.push({ ...adData, id: Date.now(), local: true });
    localStorage.setItem('localAds', JSON.stringify(localAds));

    // Save to backend
    await fetch('http://localhost:5000/api/ads/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adData)
    });

    loadAds();
    setFormData({
      title: '', description: '', ad_type: 'banner', placement: 'home_top',
      sponsor_name: '', link_url: '', budget: 0, start_date: '', end_date: ''
    });
    setMediaPreview('');
  };

  const deleteAd = async (id: number, isLocal: boolean) => {
    if (isLocal) {
      const localAds = JSON.parse(localStorage.getItem('localAds') || '[]');
      localStorage.setItem('localAds', JSON.stringify(localAds.filter((a: any) => a.id !== id)));
    } else {
      await fetch(`http://localhost:5000/api/ads/admin/${id}`, { method: 'DELETE' });
    }
    loadAds();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Advertisement Management</h2>
        <div className="flex gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold">{ads.reduce((sum, a) => sum + (a.impressions || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <MousePointer className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold">{ads.reduce((sum, a) => sum + (a.clicks || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Create New Advertisement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ad Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Sponsor Name"
              value={formData.sponsor_name}
              onChange={(e) => setFormData({ ...formData, sponsor_name: e.target.value })}
              className="px-4 py-3 border rounded-lg"
              required
            />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
            rows={3}
          />

          <div className="grid grid-cols-3 gap-4">
            <select
              value={formData.ad_type}
              onChange={(e) => setFormData({ ...formData, ad_type: e.target.value })}
              className="px-4 py-3 border rounded-lg"
            >
              <option value="banner">Banner</option>
              <option value="video">Video</option>
              <option value="carousel">Carousel</option>
              <option value="popup">Popup</option>
            </select>

            <select
              value={formData.placement}
              onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
              className="px-4 py-3 border rounded-lg"
            >
              <option value="home_top">Home Top</option>
              <option value="home_sidebar">Home Sidebar</option>
              <option value="product_page">Product Page</option>
              <option value="checkout">Checkout</option>
            </select>

            <input
              type="number"
              placeholder="Budget ($)"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
              className="px-4 py-3 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="px-4 py-3 border rounded-lg"
              required
            />
          </div>

          <input
            type="url"
            placeholder="Link URL"
            value={formData.link_url}
            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg"
          />

          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
              id="media-upload"
            />
            <label htmlFor="media-upload" className="cursor-pointer">
              {mediaPreview ? (
                formData.ad_type === 'video' ? (
                  <video src={mediaPreview} className="max-h-48 mx-auto rounded" controls />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                )
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-gray-600">Click to upload image or video</p>
                </div>
              )}
            </label>
          </div>

          <Button type="submit" className="w-full py-6 text-lg">Create Advertisement</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Active Advertisements</h3>
        <div className="space-y-4">
          {ads.map((ad) => (
            <Card key={ad.id} className="p-4 flex items-center gap-4">
              <img src={ad.image_url} alt={ad.title} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h4 className="font-bold">{ad.title}</h4>
                <p className="text-sm text-gray-600">{ad.sponsor_name}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {ad.impressions || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointer className="w-4 h-4" /> {ad.clicks || 0}
                  </span>
                  <span className="text-green-600 font-semibold">
                    CTR: {ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0}%
                  </span>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteAd(ad.id, ad.local)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
