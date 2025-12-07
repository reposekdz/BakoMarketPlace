import { useState, useEffect } from 'react';
import { Upload, Video, Image as ImageIcon, Link, Eye, MousePointer, Trash2, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

export function AdvertisementManager() {
  const [ads, setAds] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '', description: '', ad_type: 'banner', placement: 'home_top',
    sponsor_name: '', link_url: '', budget: 0, start_date: '', end_date: ''
  });
  const [mediaPreview, setMediaPreview] = useState('');

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = () => {
    const localAds = JSON.parse(localStorage.getItem('localAds') || '[]');
    setAds(localAds);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const adData = {
      ...formData,
      id: Date.now(),
      image_url: mediaPreview,
      video_url: formData.ad_type === 'video' ? mediaPreview : null,
      impressions: 0,
      clicks: 0,
      status: 'active',
      local: true
    };

    const localAds = JSON.parse(localStorage.getItem('localAds') || '[]');
    localAds.push(adData);
    localStorage.setItem('localAds', JSON.stringify(localAds));

    toast.success('Advertisement created successfully!');
    loadAds();
    setFormData({
      title: '', description: '', ad_type: 'banner', placement: 'home_top',
      sponsor_name: '', link_url: '', budget: 0, start_date: '', end_date: ''
    });
    setMediaPreview('');
  };

  const deleteAd = (id: number) => {
    const localAds = JSON.parse(localStorage.getItem('localAds') || '[]');
    localStorage.setItem('localAds', JSON.stringify(localAds.filter((a: any) => a.id !== id)));
    toast.success('Advertisement deleted');
    loadAds();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
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
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Active Ads</p>
              <p className="text-2xl font-bold">{ads.filter(a => a.status === 'active').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Create New Advertisement</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Ad Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              placeholder="Sponsor Name"
              value={formData.sponsor_name}
              onChange={(e) => setFormData({ ...formData, sponsor_name: e.target.value })}
              required
            />
          </div>

          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-3 gap-4">
            <Select value={formData.ad_type} onValueChange={(v) => setFormData({ ...formData, ad_type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="banner">Banner</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
              </SelectContent>
            </Select>

            <Select value={formData.placement} onValueChange={(v) => setFormData({ ...formData, placement: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home_top">Home Top</SelectItem>
                <SelectItem value="home_sidebar">Home Sidebar</SelectItem>
                <SelectItem value="product_page">Product Page</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Budget ($)"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
            <Input
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              required
            />
          </div>

          <Input
            type="url"
            placeholder="Link URL"
            value={formData.link_url}
            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
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
              {ad.video_url ? (
                <div className="relative w-24 h-24">
                  <video src={ad.video_url} className="w-full h-full object-cover rounded" />
                  <Play className="absolute inset-0 m-auto w-8 h-8 text-white" />
                </div>
              ) : (
                <img src={ad.image_url} alt={ad.title} className="w-24 h-24 object-cover rounded" />
              )}
              <div className="flex-1">
                <h4 className="font-bold">{ad.title}</h4>
                <p className="text-sm text-gray-600">{ad.sponsor_name} • {ad.placement}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {ad.impressions || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointer className="w-4 h-4" /> {ad.clicks || 0}
                  </span>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteAd(ad.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
