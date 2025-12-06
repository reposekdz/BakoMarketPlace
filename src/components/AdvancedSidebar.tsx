import { Smartphone, Laptop, Shirt, Home, Dumbbell, Sparkles, Star, Award, Zap, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface AdvancedSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (sizes: string[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  freeShipping: boolean;
  setFreeShipping: (value: boolean) => void;
}

const categories = [
  { id: 'all', name: 'All Products', icon: Sparkles },
  { id: 'electronics', name: 'Electronics', icon: Smartphone },
  { id: 'computers', name: 'Computers & Laptops', icon: Laptop },
  { id: 'fashion', name: 'Fashion & Apparel', icon: Shirt },
  { id: 'home', name: 'Home & Living', icon: Home },
  { id: 'sports', name: 'Sports & Outdoors', icon: Dumbbell },
];

const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Nike', 'Adidas'];
const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function AdvancedSidebar({ 
  selectedCategory, 
  setSelectedCategory, 
  priceRange, 
  setPriceRange,
  selectedBrands,
  setSelectedBrands,
  selectedColors,
  setSelectedColors,
  selectedSizes,
  setSelectedSizes,
  minRating,
  setMinRating,
  freeShipping,
  setFreeShipping
}: AdvancedSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    brand: true,
    color: false,
    size: false,
    rating: true,
    shipping: true,
    offers: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setMinRating(0);
    setFreeShipping(false);
  };

  const activeFiltersCount = selectedBrands.length + selectedColors.length + selectedSizes.length + 
    (minRating > 0 ? 1 : 0) + (freeShipping ? 1 : 0);

  return (
    <aside className="w-80 bg-white border-r border-gray-200 sticky top-[180px] h-[calc(100vh-180px)] overflow-y-auto">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-600" />
          <h3>Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button 
            onClick={clearAllFilters}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3>Categories</h3>
            </div>
            {expandedSections.category ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3>Price Range</h3>
            {expandedSections.price ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.price && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Min"
                />
                <span className="text-gray-500">—</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Max"
                />
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => toggleSection('brand')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3>Brand</h3>
            {expandedSections.brand ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.brand && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-purple-600"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => toggleSection('color')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3>Color</h3>
            {expandedSections.color ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.color && (
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`px-3 py-1 rounded-full border-2 transition-all ${
                    selectedColors.includes(color)
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => toggleSection('size')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3>Size</h3>
            {expandedSections.size ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.size && (
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    selectedSizes.includes(size)
                      ? 'border-purple-600 bg-purple-50 text-purple-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => toggleSection('rating')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3>Customer Rating</h3>
            {expandedSections.rating ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.rating && (
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    minRating === rating ? 'bg-purple-50 border-2 border-purple-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">& Up</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shipping Options */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => toggleSection('shipping')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3>Shipping</h3>
            {expandedSections.shipping ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.shipping && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-purple-600"
                  checked={freeShipping}
                  onChange={(e) => setFreeShipping(e.target.checked)}
                />
                <span>Free Shipping</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-purple-600" />
                <span>Express Delivery</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-purple-600" />
                <span>Same Day Delivery</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-purple-600" />
                <span>International Shipping</span>
              </label>
            </div>
          )}
        </div>

        {/* Special Offers */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => toggleSection('offers')}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3>Special Offers</h3>
            {expandedSections.offers ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSections.offers && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-purple-600" />
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Flash Deals</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-purple-600" />
                <Award className="w-4 h-4 text-blue-500" />
                <span>Top Rated</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-purple-600" />
                <Star className="w-4 h-4 text-purple-500" />
                <span>Premium Sellers</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-purple-600" />
                <span>Trade Assurance</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-purple-600" />
                <span>Bulk Deals</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
