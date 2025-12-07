import { useState } from 'react';
import { Award, Building2, User, Mail, Phone, Globe, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface SponsorshipFormProps {
  expoId: number;
  expoName: string;
  onSuccess: () => void;
}

export function SponsorshipForm({ expoId, expoName, onSuccess }: SponsorshipFormProps) {
  const [formData, setFormData] = useState({
    package_type: 'bronze',
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    logo_url: ''
  });

  const packages = {
    bronze: { amount: 5000, benefits: ['Logo on website', 'Social media mention'] },
    silver: { amount: 10000, benefits: ['Logo on website', 'Booth space', 'Speaking slot'] },
    gold: { amount: 25000, benefits: ['Premium booth', 'Keynote slot', 'VIP access'] },
    platinum: { amount: 50000, benefits: ['Title sponsor', 'Main stage', 'Full branding'] }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('http://localhost:5000/api/expo-apply/sponsor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expo_id: expoId,
        ...formData,
        amount: packages[formData.package_type as keyof typeof packages].amount
      })
    });

    if (res.ok) {
      toast.success('Sponsorship application submitted!');
      onSuccess();
      setFormData({
        package_type: 'bronze',
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        website: '',
        logo_url: ''
      });
    } else {
      toast.error('Failed to submit application');
    }
  };

  const selectedPackage = packages[formData.package_type as keyof typeof packages];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-8 h-8 text-yellow-600" />
        <div>
          <h3 className="text-2xl font-bold">Become a Sponsor</h3>
          <p className="text-gray-600">{expoName}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Sponsorship Package</label>
          <Select value={formData.package_type} onValueChange={(v) => setFormData({ ...formData, package_type: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bronze">Bronze - $5,000</SelectItem>
              <SelectItem value="silver">Silver - $10,000</SelectItem>
              <SelectItem value="gold">Gold - $25,000</SelectItem>
              <SelectItem value="platinum">Platinum - $50,000</SelectItem>
            </SelectContent>
          </Select>
          
          <Card className="mt-3 p-4 bg-blue-50">
            <p className="font-semibold mb-2">Package Benefits:</p>
            <ul className="space-y-1">
              {selectedPackage.benefits.map((benefit, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  {benefit}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-lg font-bold text-blue-600">
              ${selectedPackage.amount.toLocaleString()}
            </p>
          </Card>
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
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Contact Person Name"
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            className="pl-10"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10"
              required
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="url"
            placeholder="Company Website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Company Logo URL"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            className="pl-10"
          />
        </div>

        <Button type="submit" className="w-full py-6 text-lg bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
          Submit Sponsorship Application
        </Button>
      </form>
    </Card>
  );
}
