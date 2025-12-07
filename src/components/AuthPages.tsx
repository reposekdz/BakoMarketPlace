import { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Building, Globe, Eye, EyeOff, Facebook, Chrome, Apple, Shield, Check, Zap, Store, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AuthPagesProps {
  onLogin: (userData: any) => void;
}

export function AuthPages({ onLogin }: AuthPagesProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'seller'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    shopName: '',
    shopCategory: '',
    businessType: '',
    taxId: '',
    acceptTerms: false,
    newsletter: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'register' || mode === 'seller') {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }
      if (!formData.acceptTerms) {
        toast.error('Please accept the terms and conditions');
        return;
      }
    }

    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email,
      firstName: formData.firstName || 'Demo',
      lastName: formData.lastName || 'User',
      phone: formData.phone,
      isSeller: mode === 'seller',
      shopName: formData.shopName,
      shopCategory: formData.shopCategory,
      createdAt: new Date().toISOString()
    };

    toast.success(mode === 'login' ? 'Login successful!' : 'Account created successfully!');
    onLogin(userData);
  };

  const handleSocialLogin = (provider: string) => {
    toast.success(`Logging in with ${provider}...`);
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      email: `demo@${provider}.com`,
      firstName: 'Demo',
      lastName: 'User',
      isSeller: false,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-2 gap-8">
        {/* Left Side - Marketing */}
        <div className="text-white space-y-8">
          <div>
            <h1 className="mb-4 text-white">Welcome to Bako</h1>
            <p className="text-xl text-white/90">The world's most powerful marketplace</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="mb-2 text-white">Create Your Online Shop</h3>
                <p className="text-white/80">Set up your store in minutes and start selling to millions of customers worldwide</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="mb-2 text-white">Advanced Analytics</h3>
                <p className="text-white/80">Track your sales, customers, and growth with powerful real-time analytics</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="mb-2 text-white">Instant Messaging & Video Calls</h3>
                <p className="text-white/80">Connect with buyers through real-time chat and video calls</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="mb-2 text-white">Secure Payments</h3>
                <p className="text-white/80">100% secure transactions with buyer and seller protection</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-white">2M+</p>
                <p className="text-white/80">Active Sellers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">50M+</p>
                <p className="text-white/80">Products Listed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">180+</p>
                <p className="text-white/80">Countries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setMode('seller')}
              className={`flex-1 py-3 rounded-lg transition-all ${
                mode === 'seller'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Become Seller
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login Mode */}
            {mode === 'login' && (
              <>
                <div>
                  <label className="block mb-2 text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-purple-600" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-purple-600 hover:underline">
                    Forgot password?
                  </button>
                </div>
              </>
            )}

            {/* Register Mode */}
            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-700">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="First name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Create password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                  <div className="mt-2 flex gap-2 text-xs">
                    <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                      <Check className="w-3 h-3 inline" /> 8+ characters
                    </span>
                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                      <Check className="w-3 h-3 inline" /> Uppercase
                    </span>
                    <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                      <Check className="w-3 h-3 inline" /> Number
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 accent-purple-600"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the <button type="button" className="text-purple-600 hover:underline">Terms of Service</button> and <button type="button" className="text-purple-600 hover:underline">Privacy Policy</button>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-purple-600"
                    checked={formData.newsletter}
                    onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                  />
                  <span className="text-sm text-gray-600">Subscribe to newsletter for exclusive deals</span>
                </label>
              </>
            )}

            {/* Seller Registration Mode */}
            {mode === 'seller' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-700">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="First name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Shop Name</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.shopName}
                      onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Your shop name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Shop Category</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.shopCategory}
                      onChange={(e) => setFormData({ ...formData, shopCategory: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion & Apparel</option>
                      <option value="home">Home & Living</option>
                      <option value="beauty">Beauty & Personal Care</option>
                      <option value="sports">Sports & Outdoors</option>
                      <option value="books">Books & Media</option>
                      <option value="toys">Toys & Games</option>
                      <option value="automotive">Automotive</option>
                      <option value="food">Food & Beverages</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="shop@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Business Type</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="individual">Individual Seller</option>
                    <option value="small">Small Business</option>
                    <option value="medium">Medium Enterprise</option>
                    <option value="large">Large Corporation</option>
                    <option value="brand">Brand/Manufacturer</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Tax ID / Business Registration</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Tax ID or Business Registration Number"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Create password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 accent-purple-600"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the <button type="button" className="text-purple-600 hover:underline">Seller Terms</button>, <button type="button" className="text-purple-600 hover:underline">Terms of Service</button> and <button type="button" className="text-purple-600 hover:underline">Privacy Policy</button>
                  </span>
                </label>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-shadow"
            >
              {mode === 'login' ? 'Sign In' : mode === 'seller' ? 'Create Seller Account' : 'Create Account'}
            </button>

            {/* Social Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                <span className="text-gray-700">Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Facebook</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Apple className="w-5 h-5 text-gray-800" />
                <span className="text-gray-700">Apple</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
