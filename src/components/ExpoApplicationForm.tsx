import { useState } from 'react';
import { Building2, Mail, Phone, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface ExpoApplicationFormProps {
  expoId: number;
  expoName: string;
  shopId?: number;
  onSuccess: () => void;
}

export function ExpoApplicationForm({ expoId, expoName, shopId, onSuccess }: ExpoApplicationFormProps) {
  const [formData, setFormData] = useState({
    booth_type: 'standard',
    company_name: '',
    contact_email: '',
    contact_phone: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('http://localhost:5000/api/expo-apply/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expo_id: expoId,
        shop_id: shopId || 1,
        ...formData
      })
    });

    if (res.ok) {
      toast.success('Application submitted successfully!');
      onSuccess();
      setFormData({
        booth_type: 'standard',
        company_name: '',
        contact_email: '',
        contact_phone: '',
        description: ''
      });
    } else {
      toast.error('Failed to submit application');
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-2">Apply for Expo Booth</h3>
      <p className="text-gray-600 mb-6">{expoName}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Booth Type</label>
          <Select value={formData.booth_type} onValueChange={(v) => setFormData({ ...formData, booth_type: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard - $500</SelectItem>
              <SelectItem value="premium">Premium - $1,000</SelectItem>
              <SelectItem value="vip">VIP - $2,500</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Company Name"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            className="pl-10"
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="email"
            placeholder="Contact Email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            className="pl-10"
            required
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="tel"
            placeholder="Contact Phone"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            className="pl-10"
            required
          />
        </div>

        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Textarea
            placeholder="Tell us about your business and what you'll showcase..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="pl-10"
            rows={4}
            required
          />
        </div>

        <Button type="submit" className="w-full py-6 text-lg">Submit Application</Button>
      </form>
    </Card>
  );
}
