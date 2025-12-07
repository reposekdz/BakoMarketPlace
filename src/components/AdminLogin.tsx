import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Lock, Mail, Shield, Eye, EyeOff, Sparkles, Zap, BarChart3, Users, Settings } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export function AdminLogin({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const [email, setEmail] = useState('reponsekdz06@gmail.com');
  const [password, setPassword] = useState('2025');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        toast.success('Login successful!');
        onLogin(data.token, data.user);
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full">
          {/* Left Side - Branding & Features */}
          <div className="text-white space-y-8 flex flex-col justify-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Admin Portal
                  </h1>
                  <p className="text-white/70">Bako Marketplace Control Center</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time insights & performance metrics' },
                { icon: Users, title: 'User Management', desc: 'Complete control over users & sellers' },
                { icon: Settings, title: 'System Configuration', desc: 'Customize platform settings & features' },
                { icon: Zap, title: 'Instant Actions', desc: 'Quick access to critical operations' }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-white/60 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <p className="text-lg font-semibold">Secure & Powerful</p>
              </div>
              <p className="text-white/70 text-sm">Enterprise-grade security with advanced encryption and multi-factor authentication</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0 p-10 rounded-3xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Administrator Login</h2>
              <p className="text-gray-600">Enter your credentials to access the admin panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">Forgot password?</a>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span>Sign In to Admin Panel</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-purple-900 font-semibold">Demo Admin Credentials</p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-purple-700"><span className="font-medium">Email:</span> reponsekdz06@gmail.com</p>
                <p className="text-purple-700"><span className="font-medium">Password:</span> 2025</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500">
                Protected by enterprise-grade security • All actions are logged
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
