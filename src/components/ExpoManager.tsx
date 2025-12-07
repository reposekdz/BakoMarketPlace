import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, DollarSign, Award, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

export function ExpoManager() {
  const [expos, setExpos] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', start_date: '', end_date: '',
    max_booths: 100, booth_price: 0, banner_image: '', location: ''
  });

  useEffect(() => {
    loadExpos();
    loadApplications();
    loadSponsors();
  }, []);

  const loadExpos = async () => {
    const res = await fetch('http://localhost:5000/api/expo');
    if (res.ok) {
      const data = await res.json();
      setExpos(data);
    }
  };

  const loadApplications = async () => {
    const res = await fetch('http://localhost:5000/api/expo-apply/applications');
    if (res.ok) {
      const data = await res.json();
      setApplications(data);
    }
  };

  const loadSponsors = async () => {
    const res = await fetch('http://localhost:5000/api/expo-apply/sponsors');
    if (res.ok) {
      const data = await res.json();
      setSponsors(data);
    }
  };

  const handleCreateExpo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('http://localhost:5000/api/expo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      toast.success('Expo created successfully!');
      loadExpos();
      setFormData({
        name: '', description: '', category: '', start_date: '', end_date: '',
        max_booths: 100, booth_price: 0, banner_image: '', location: ''
      });
    }
  };

  const approveApplication = async (id: number) => {
    const res = await fetch(`http://localhost:5000/api/expo-apply/applications/${id}/approve`, {
      method: 'PUT'
    });
    if (res.ok) {
      toast.success('Application approved!');
      loadApplications();
    }
  };

  const rejectApplication = async (id: number) => {
    const res = await fetch(`http://localhost:5000/api/expo-apply/applications/${id}/reject`, {
      method: 'PUT'
    });
    if (res.ok) {
      toast.success('Application rejected');
      loadApplications();
    }
  };

  const approveSponsor = async (id: number) => {
    const res = await fetch(`http://localhost:5000/api/expo-apply/sponsors/${id}/activate`, {
      method: 'PUT'
    });
    if (res.ok) {
      toast.success('Sponsor activated!');
      loadSponsors();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Expos</p>
              <p className="text-2xl font-bold">{expos.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Applications</p>
              <p className="text-2xl font-bold">{applications.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Sponsors</p>
              <p className="text-2xl font-bold">{sponsors.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold">${expos.reduce((sum, e) => sum + (e.total_revenue || 0), 0).toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Create New Expo</h3>
        <form onSubmit={handleCreateExpo} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Expo Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

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

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              placeholder="Max Booths"
              value={formData.max_booths}
              onChange={(e) => setFormData({ ...formData, max_booths: parseInt(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Booth Price ($)"
              value={formData.booth_price}
              onChange={(e) => setFormData({ ...formData, booth_price: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <Input
            placeholder="Banner Image URL"
            value={formData.banner_image}
            onChange={(e) => setFormData({ ...formData, banner_image: e.target.value })}
          />

          <Button type="submit" className="w-full py-6 text-lg">Create Expo</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Booth Applications</h3>
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold">{app.shop_name}</h4>
                <p className="text-sm text-gray-600">Expo: {app.expo_name} • Booth Type: {app.booth_type}</p>
                <p className="text-sm text-gray-600">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                {app.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => approveApplication(app.id)}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => rejectApplication(app.id)}>Reject</Button>
                  </>
                )}
                {app.status !== 'pending' && (
                  <span className={`px-3 py-1 rounded text-sm ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {app.status}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Sponsorship Applications</h3>
        <div className="space-y-4">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold">{sponsor.company_name}</h4>
                <p className="text-sm text-gray-600">Package: {sponsor.package_type} • Amount: ${sponsor.amount}</p>
                <p className="text-sm text-gray-600">Contact: {sponsor.email}</p>
              </div>
              <div className="flex gap-2">
                {sponsor.status === 'pending' && (
                  <Button size="sm" onClick={() => approveSponsor(sponsor.id)}>Activate</Button>
                )}
                {sponsor.status === 'active' && (
                  <span className="px-3 py-1 rounded text-sm bg-green-100 text-green-800">Active</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
