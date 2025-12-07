import { useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Sparkles, ArrowLeft, Shield, Zap, Star, TrendingUp, Award, Gift, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ModernAuthPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: any) => void;
}

export function ModernAuthPanel({ isOpen, onClose, onLogin }: ModernAuthPanelProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'login') {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        
        if (res.ok) {
          const data = await res.json();
          onLogin({ userId: data.userId, email: formData.email, token: data.token });
          onClose();
        } else {
          alert('Invalid credentials');
        }
      } else {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          onLogin({ userId: data.userId, email: formData.email, token: data.token });
          onClose();
        } else {
          alert('Registration failed');
        }
      }
    } catch (error) {
      alert('Connection error');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-white font-bold text-xl">Bako Marketplace</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Fast Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Left Side - Benefits */}
          <div className="text-white space-y-8">
            <div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                {mode === 'login' ? 'Welcome Back!' : 'Join Bako Today'}
              </h1>
              <p className="text-xl text-white/80">
                {mode === 'login' 
                  ? 'Continue your shopping journey with exclusive deals' 
                  : 'Start shopping with millions of products worldwide'}
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Star, title: 'Premium Quality', desc: 'Verified sellers & authentic products' },
                { icon: TrendingUp, title: 'Best Prices', desc: 'Competitive pricing & daily deals' },
                { icon: Award, title: 'Rewards Program', desc: 'Earn points on every purchase' },
                { icon: Gift, title: 'Exclusive Offers', desc: 'Member-only discounts & perks' }
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-white/70 text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold">2M+</p>
                  <p className="text-white/70 text-sm">Happy Customers</p>
                </div>
              </div>
              <p className="text-white/80 text-sm">Join millions of satisfied shoppers worldwide</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 p-8 rounded-3xl">

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
            </p>
          </div>

          <div className="overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {mode === 'login' && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                </div>
              )}

              <Button type="submit" className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button type="button" variant="outline" className="py-6">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                </Button>
                <Button type="button" variant="outline" className="py-6">
                  <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5" />
                </Button>
                <Button type="button" variant="outline" className="py-6">
                  <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-blue-600 font-semibold hover:underline"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}
