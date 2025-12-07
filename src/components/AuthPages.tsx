import { useState } from 'react';
import { Mail, Lock, User, Phone, Building, Eye, EyeOff, Facebook, Chrome, Apple, Shield, Check, Zap, Store, TrendingUp, X, Fingerprint, Smartphone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AuthPagesProps {
  onLogin: (userData: any) => void;
  onClose?: () => void;
}

export function AuthPages({ onLogin, onClose }: AuthPagesProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'seller'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [use2FA, setUse2FA] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    shopName: '',
    shopCategory: '',
    businessType: '',
    taxId: '',
    acceptTerms: false,
    newsletter: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode !== 'login') {
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
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:rotate-90 duration-300"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 my-8">
        <div className="text-white space-y-8 p-8">
          <div>
            <h1 className="text-5xl font-bold mb-4 text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text">Welcome to Bako</h1>
            <p className="text-2xl text-white/90">The world's most powerful marketplace</p>
          </div>

          <div className="space-y-6">
            {[
              { icon: Store, title: 'Create Your Online Shop', desc: 'Set up your store in minutes and start selling to millions of customers worldwide' },
              { icon: TrendingUp, title: 'Advanced Analytics', desc: 'Track your sales, customers, and growth with powerful real-time analytics' },
              { icon: Zap, title: 'Instant Messaging & Video Calls', desc: 'Connect with buyers through real-time chat and video calls' },
              { icon: Shield, title: 'Secure Payments', desc: '100% secure transactions with buyer and seller protection' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <item.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-white/80">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[{ num: '2M+', label: 'Active Sellers' }, { num: '50M+', label: 'Products Listed' }, { num: '180+', label: 'Countries' }].map((stat, i) => (
                <div key={i}>
                  <p className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">{stat.num}</p>
                  <p className="text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
          <div className="flex gap-2 mb-8 bg-gray-100 rounded-2xl p-1.5">
            {[
              { id: 'login', label: 'Login' },
              { id: 'register', label: 'Register' },
              { id: 'seller', label: 'Become Seller' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id as any)}
                className={`flex-1 py-3 rounded-xl transition-all font-semibold ${
                  mode === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'login' && (
              <>
                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
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
                  <button type="button" className="text-sm text-purple-600 hover:underline font-medium">
                    Forgot password?
                  </button>
                </div>

                <div className="space-y-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={use2FA} onChange={(e) => setUse2FA(e.target.checked)} className="w-5 h-5 accent-purple-600" />
                    <Smartphone className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium">Enable 2FA Authentication</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={useBiometric} onChange={(e) => setUseBiometric(e.target.checked)} className="w-5 h-5 accent-purple-600" />
                    <Fingerprint className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium">Use Biometric Login</span>
                  </label>
                </div>
              </>
            )}

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">First Name</label>
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
                    <label className="block mb-2 text-gray-700 font-medium">Last Name</label>
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
                  <label className="block mb-2 text-gray-700 font-medium">Email Address</label>
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
                  <label className="block mb-2 text-gray-700 font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="+250 XXX XXX XXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Password</label>
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
                  <div className="mt-2 flex gap-3 text-xs">
                    <span className={formData.password.length >= 8 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      <Check className="w-3 h-3 inline" /> 8+ chars
                    </span>
                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      <Check className="w-3 h-3 inline" /> Uppercase
                    </span>
                    <span className={/[0-9]/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      <Check className="w-3 h-3 inline" /> Number
                    </span>
                    <span className={/[!@#$%^&*]/.test(formData.password) ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      <Check className="w-3 h-3 inline" /> Special
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Confirm Password</label>
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
                    I agree to the <button type="button" className="text-purple-600 hover:underline font-medium">Terms of Service</button> and <button type="button" className="text-purple-600 hover:underline font-medium">Privacy Policy</button>
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

            {mode === 'seller' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">First Name</label>
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
                    <label className="block mb-2 text-gray-700 font-medium">Last Name</label>
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
                  <label className="block mb-2 text-gray-700 font-medium">Shop Name</label>
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
                  <label className="block mb-2 text-gray-700 font-medium">Shop Category</label>
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
                  <label className="block mb-2 text-gray-700 font-medium">Email Address</label>
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
                  <label className="block mb-2 text-gray-700 font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="+250 XXX XXX XXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Business Type</label>
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
                  <label className="block mb-2 text-gray-700 font-medium">Tax ID / Business Registration</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="Tax ID or Business Registration Number"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-medium">Password</label>
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
                  <label className="block mb-2 text-gray-700 font-medium">Confirm Password</label>
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
                    I agree to the <button type="button" className="text-purple-600 hover:underline font-medium">Seller Terms</button>, <button type="button" className="text-purple-600 hover:underline font-medium">Terms of Service</button> and <button type="button" className="text-purple-600 hover:underline font-medium">Privacy Policy</button>
                  </span>
                </label>
              </>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-2xl transition-all font-semibold text-lg hover:scale-105"
            >
              {mode === 'login' ? 'Sign In' : mode === 'seller' ? 'Create Seller Account' : 'Create Account'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Chrome, name: 'Google', color: 'text-red-500' },
                { icon: Facebook, name: 'Facebook', color: 'text-blue-600' },
                { icon: Apple, name: 'Apple', color: 'text-gray-800' }
              ].map((social) => (
                <button
                  key={social.name}
                  type="button"
                  onClick={() => handleSocialLogin(social.name)}
                  className="py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-500 transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                  <social.icon className={`w-5 h-5 ${social.color}`} />
                  <span className="text-gray-700 font-medium">{social.name}</span>
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
