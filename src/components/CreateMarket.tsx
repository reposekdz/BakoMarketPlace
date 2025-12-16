import { useState } from 'react';
import { Camera, Upload, X, Building, Link, Mail, Image, Tag } from 'lucide-react';

// Define the shape of a market object
export interface Market {
  id: string;
  name: string;
  description: string;
  logo: File | null;
  banner: File | null;
  category: string;
  tags: string[];
  contactEmail: string;
  website?: string;
}

interface CreateMarketProps {
  onClose: () => void;
  onCreateMarket: (market: Market) => void;
}

const marketCategories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Toys & Games",
  "Health & Beauty",
  "Sports & Outdoors",
  "Automotive",
  "Books & Media",
  "Handmade",
  "Other"
];

export function CreateMarket({ onClose, onCreateMarket }: CreateMarketProps) {
  const [marketName, setMarketName] = useState('');
  const [marketDescription, setMarketDescription] = useState('');
  const [marketLogo, setMarketLogo] = useState<File | null>(null);
  const [marketBanner, setMarketBanner] = useState<File | null>(null);
  const [marketCategory, setMarketCategory] = useState(marketCategories[0]);
  const [marketTags, setMarketTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [website, setWebsite] = useState('');


  const handleCreateMarket = (e: React.FormEvent) => {
    e.preventDefault();
    const newMarket: Market = {
      id: `market-${Date.now()}`, // simple unique id
      name: marketName,
      description: marketDescription,
      logo: marketLogo,
      banner: marketBanner,
      category: marketCategory,
      tags: marketTags,
      contactEmail,
      website
    };
    onCreateMarket(newMarket);
    onClose(); // Close the modal after creation
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!marketTags.includes(tagInput.trim())) {
        setMarketTags([...marketTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMarketTags(marketTags.filter(tag => tag !== tagToRemove));
  };


  return (
    <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3"><Building />Create Your Own Market</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleCreateMarket}>
        <div className="space-y-8">
          
          {/* Market Banner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market Banner</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {marketBanner ? (
                   <img src={URL.createObjectURL(marketBanner)} alt="Market Banner" className="mx-auto h-24 w-auto object-cover rounded-md" />
                ) : (
                  <Image size={40} className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="banner-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                    <span>Upload a banner</span>
                    <input id="banner-upload" name="banner-upload" type="file" className="sr-only" onChange={(e) => e.target.files && setMarketBanner(e.target.files[0])} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB. Recommended 1200x400px.</p>
              </div>
            </div>
          </div>

          {/* Market Logo and Name */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">Market Logo</label>
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 relative group">
                    {marketLogo ? (
                        <img src={URL.createObjectURL(marketLogo)} alt="Market Logo" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <Camera size={32} className="text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs text-center">Change Logo</span>
                    </div>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => e.target.files && setMarketLogo(e.target.files[0])} accept="image/*" />
                </div>
            </div>

            <div className="flex-grow">
              <label htmlFor="marketName" className="block text-sm font-medium text-gray-700 mb-2">Market Name</label>
              <input
                type="text"
                id="marketName"
                value={marketName}
                onChange={(e) => setMarketName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., John's Electronics"
                required
              />
            </div>
          </div>


          {/* Market Description */}
          <div>
            <label htmlFor="marketDescription" className="block text-sm font-medium text-gray-700 mb-1">Market Description</label>
            <textarea
              id="marketDescription"
              value={marketDescription}
              onChange={(e) => setMarketDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Tell us about your market, what you sell, and what makes it special..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market Category */}
            <div>
              <label htmlFor="marketCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="marketCategory"
                value={marketCategory}
                onChange={(e) => setMarketCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
              >
                {marketCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            {/* Market Tags */}
            <div>
              <label htmlFor="marketTags" className="block text-sm font-medium text-gray-700 mb-1">Tags / Keywords</label>
              <div className="border border-gray-300 rounded-md p-2 flex flex-wrap gap-2">
                {marketTags.map((tag) => (
                  <div key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <Tag size={14}/>
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.currentTarget.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-grow p-1 outline-none"
                  placeholder={marketTags.length < 5 ? "Add up to 5 tags..." : "Max 5 tags"}
                  disabled={marketTags.length >= 5}
                />
              </div>
                <p className="text-xs text-gray-500 mt-1">Help customers find your market. Press Enter to add a tag.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Contact Email */}
             <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Mail size={16} /> Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="you@example.com"
                required
              />
            </div>
            
             {/* Website URL */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Link size={16} /> Website (optional)</label>
              <input
                type="url"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://your-market.com"
              />
            </div>
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
          <button type="submit" className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!marketName || !marketDescription}>
            <Upload size={18} />
            Create Market
          </button>ITemplate
        </div>
      </form>
    </div>
  );
}
