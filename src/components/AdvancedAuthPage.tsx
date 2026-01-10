import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, Shield, Fingerprint,
  Facebook, Chrome, Apple, Github, Linkedin, Twitter,
  Check, X, AlertCircle, Sparkles, Globe, Building, MapPin,
  Camera, Upload, UserCircle, Store, Package, TrendingUp,
  Star, Award, Zap, ShieldCheck, KeyRound, Smartphone,
  QrCode, MessageSquare, Send, CheckCircle, XCircle
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';

interface AdvancedAuthPageProps {
  onLogin: (user: any) => void;
}

export function AdvancedAuthPage({ onLogin }: AdvancedAuthPageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'seller'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [step, setStep] = useState<'credentials' | '2fa' | 'biometric' | 'complete'>('credentials');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'sms' | 'authenticator'>('email');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Seller-specific fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [taxId, setTaxId] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [businessLogo, setBusinessLogo] = useState<File | null>(null);
  const [businessBanner, setBusinessBanner] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 40) return { label: 'Weak', color: 'bg-red-500' };
    if (passwordStrength < 70) return { label: 'Medium', color: 'bg-yellow-500' };
    if (passwordStrength < 90) return { label: 'Strong', color: 'bg-green-500' };
    return { label: 'Very Strong', color: 'bg-emerald-500' };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'logo') {
        setBusinessLogo(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setBusinessBanner(file);
        setBannerPreview(URL.createObjectURL(file));
      }
      toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully`);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.success(`Connecting to ${provider}...`);
    setTimeout(() => {
      onLogin({
        id: Date.now().toString(),
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=random`,
        provider,
        verified: true,
        isSeller: false,
        biometricEnabled: false,
        twoFactorEnabled: false
      });
      toast.success(`Successfully logged in with ${provider}!`);
    }, 1500);
  };

  const handleBiometricAuth = () => {
    toast.info('Initializing biometric authentication...');
    setTimeout(() => {
      setBiometricEnabled(true);
      setStep('complete');
      toast.success('Biometric authentication successful!');
    }, 2000);
  };

  const handleSend2FA = () => {
    toast.success(`Verification code sent via ${verificationMethod}!`);
    setTimeout(() => {
      setTwoFactorCode('123456'); // Simulated
    }, 1000);
  };

  const handleVerify2FA = () => {
    if (twoFactorCode === '123456' || twoFactorCode.length === 6) {
      toast.success('2FA verification successful!');
      setStep('biometric');
    } else {
      toast.error('Invalid verification code');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (twoFactorEnabled) {
      setStep('2fa');
      handleSend2FA();
    } else if (biometricEnabled) {
      setStep('biometric');
    } else {
      performLogin();
    }
  };

  const performLogin = () => {
    toast.success('Logging in...');
    setTimeout(() => {
      onLogin({
        id: Date.now().toString(),
        name: fullName || 'John Doe',
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'John Doe')}&background=random`,
        verified: true,
        isSeller: false,
        biometricEnabled,
        twoFactorEnabled,
        phone
      });
    }, 1000);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength < 40) {
      toast.error('Please choose a stronger password');
      return;
    }

    toast.success('Creating your account...');
    setTimeout(() => {
      onLogin({
        id: Date.now().toString(),
        name: fullName,
        email: email,
        phone: phone,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
        verified: true,
        isSeller: false,
        biometricEnabled: false,
        twoFactorEnabled: false
      });
      toast.success('Account created successfully!');
    }, 1500);
  };

  const handleSellerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName || !phone || !businessName || !businessType || !businessCategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    toast.success('Creating your seller account...');
    setTimeout(() => {
      onLogin({
        id: Date.now().toString(),
        name: fullName,
        email: email,
        phone: phone,
        avatar: logoPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=random`,
        verified: true,
        isSeller: true,
        biometricEnabled: false,
        twoFactorEnabled: false,
        shop: {
          name: businessName,
          type: businessType,
          category: businessCategory,
          address: businessAddress,
          description: businessDescription,
          taxId: taxId,
          websiteUrl: websiteUrl,
          logo: logoPreview,
          banner: bannerPreview,
          createdAt: new Date().toISOString(),
          products: [],
          rating: 0,
          reviews: 0,
          followers: 0
        }
      });
      toast.success('Seller account created successfully! Redirecting to dashboard...');
    }, 1500);
  };

  const socialProviders = [
    { name: 'Google', icon: Chrome, color: 'hover:bg-red-50 hover:border-red-300' },
    { name: 'Facebook', icon: Facebook, color: 'hover:bg-blue-50 hover:border-blue-300' },
    { name: 'Apple', icon: Apple, color: 'hover:bg-gray-100 hover:border-gray-400' },
    { name: 'GitHub', icon: Github, color: 'hover:bg-gray-50 hover:border-gray-300' },
    { name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-blue-50 hover:border-blue-400' },
    { name: 'Twitter', icon: Twitter, color: 'hover:bg-sky-50 hover:border-sky-300' },
  ];

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains number', met: /[0-9]/.test(password) },
    { label: 'Contains special character', met: /[^a-zA-Z0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() + 0.5],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl relative z-10"
      >
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Welcome to Bako
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              The most powerful marketplace platform with advanced security
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Sign Up
                </TabsTrigger>
                <TabsTrigger value="seller" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Become a Seller
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6">
                <AnimatePresence mode="wait">
                  {step === 'credentials' && (
                    <motion.div
                      key="credentials"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Social Login */}
                      <div>
                        <p className="text-sm text-gray-500 mb-3 text-center">Quick login with</p>
                        <div className="grid grid-cols-3 gap-3">
                          {socialProviders.map((provider) => (
                            <Button
                              key={provider.name}
                              variant="outline"
                              className={`flex items-center justify-center gap-2 ${provider.color} transition-all`}
                              onClick={() => handleSocialLogin(provider.name)}
                            >
                              <provider.icon className="w-5 h-5" />
                              <span className="hidden sm:inline">{provider.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <Separator />
                        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
                          Or continue with email
                        </span>
                      </div>

                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              className="pl-10"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="remember"
                              checked={rememberMe}
                              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                              Remember me
                            </label>
                          </div>
                          <Button variant="link" className="text-sm px-0">
                            Forgot password?
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Enable 2FA</Label>
                            <Switch
                              checked={twoFactorEnabled}
                              onCheckedChange={setTwoFactorEnabled}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Enable Biometric</Label>
                            <Switch
                              checked={biometricEnabled}
                              onCheckedChange={setBiometricEnabled}
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                          size="lg"
                        >
                          <Lock className="w-5 h-5 mr-2" />
                          Sign In Securely
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {step === '2fa' && (
                    <motion.div
                      key="2fa"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShieldCheck className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Two-Factor Authentication</h3>
                        <p className="text-gray-600">Enter the verification code sent to your device</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Verification Method</Label>
                          <Select value={verificationMethod} onValueChange={(v) => setVerificationMethod(v as any)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  Email
                                </div>
                              </SelectItem>
                              <SelectItem value="sms">
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4" />
                                  SMS
                                </div>
                              </SelectItem>
                              <SelectItem value="authenticator">
                                <div className="flex items-center gap-2">
                                  <QrCode className="w-4 h-4" />
                                  Authenticator App
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="2fa-code">Verification Code</Label>
                          <Input
                            id="2fa-code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            className="text-center text-2xl tracking-widest"
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>

                        <Button
                          onClick={handleSend2FA}
                          variant="outline"
                          className="w-full"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Resend Code
                        </Button>

                        <Button
                          onClick={handleVerify2FA}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500"
                          size="lg"
                        >
                          Verify & Continue
                        </Button>

                        <Button
                          onClick={() => setStep('credentials')}
                          variant="ghost"
                          className="w-full"
                        >
                          Back to Login
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 'biometric' && (
                    <motion.div
                      key="biometric"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                          <Fingerprint className="w-12 h-12 text-purple-600" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">Biometric Authentication</h3>
                        <p className="text-gray-600">Use your fingerprint or face ID to continue</p>
                      </div>

                      <Alert>
                        <Smartphone className="w-4 h-4" />
                        <AlertDescription>
                          Place your finger on the sensor or look at the camera to authenticate
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <Button
                          onClick={handleBiometricAuth}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500"
                          size="lg"
                        >
                          <Fingerprint className="w-5 h-5 mr-2" />
                          Authenticate with Biometric
                        </Button>

                        <Button
                          onClick={performLogin}
                          variant="outline"
                          className="w-full"
                        >
                          Skip Biometric
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="signup-name"
                          placeholder="John Doe"
                          className="pl-10"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="+1 234 567 8900"
                          className="pl-10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {password && (
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Password Strength:</span>
                          <Badge variant={passwordStrength < 40 ? 'destructive' : passwordStrength < 70 ? 'secondary' : 'default'}>
                            {getPasswordStrengthLabel().label}
                          </Badge>
                        </div>
                        <Progress value={passwordStrength} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {passwordRequirements.map((req, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
                              {req.met ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-gray-300" />
                              )}
                              <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                                {req.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      Security Features
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">2FA Protection</span>
                        <Switch
                          checked={twoFactorEnabled}
                          onCheckedChange={setTwoFactorEnabled}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Biometric Login</span>
                        <Switch
                          checked={biometricEnabled}
                          onCheckedChange={setBiometricEnabled}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Account
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </TabsContent>

              {/* Seller Sign Up Tab */}
              <TabsContent value="seller" className="space-y-6">
                <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                  <Store className="w-4 h-4 text-purple-600" />
                  <AlertDescription className="text-purple-900">
                    Join thousands of successful sellers on Bako! Start selling your products today with our advanced seller tools.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSellerSignup} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="seller-name">Full Name *</Label>
                        <Input
                          id="seller-name"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seller-phone">Phone Number *</Label>
                        <Input
                          id="seller-phone"
                          type="tel"
                          placeholder="+1 234 567 8900"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seller-email">Email Address *</Label>
                      <Input
                        id="seller-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Business Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="business-name">Business Name *</Label>
                        <Input
                          id="business-name"
                          placeholder="Your Store Name"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="business-type">Business Type *</Label>
                        <Select value={businessType} onValueChange={setBusinessType}>
                          <SelectTrigger id="business-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual Seller</SelectItem>
                            <SelectItem value="small-business">Small Business</SelectItem>
                            <SelectItem value="company">Company</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-category">Business Category *</Label>
                      <Select value={businessCategory} onValueChange={setBusinessCategory}>
                        <SelectTrigger id="business-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics & Gadgets</SelectItem>
                          <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                          <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                          <SelectItem value="sports">Sports & Outdoors</SelectItem>
                          <SelectItem value="toys">Toys & Games</SelectItem>
                          <SelectItem value="books">Books & Media</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                          <SelectItem value="food">Food & Beverages</SelectItem>
                          <SelectItem value="health">Health & Wellness</SelectItem>
                          <SelectItem value="pets">Pet Supplies</SelectItem>
                          <SelectItem value="office">Office Supplies</SelectItem>
                          <SelectItem value="jewelry">Jewelry & Accessories</SelectItem>
                          <SelectItem value="arts">Arts & Crafts</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-address">Business Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Textarea
                          id="business-address"
                          placeholder="Street, City, State, ZIP Code, Country"
                          className="pl-10 min-h-[80px]"
                          value={businessAddress}
                          onChange={(e) => setBusinessAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-description">Business Description</Label>
                      <Textarea
                        id="business-description"
                        placeholder="Tell customers about your business..."
                        className="min-h-[100px]"
                        value={businessDescription}
                        onChange={(e) => setBusinessDescription(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tax-id">Tax ID / Business Registration</Label>
                        <Input
                          id="tax-id"
                          placeholder="XXX-XX-XXXX"
                          value={taxId}
                          onChange={(e) => setTaxId(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website-url">Website URL</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="website-url"
                            type="url"
                            placeholder="https://yourwebsite.com"
                            className="pl-10"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Branding */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Branding Assets
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Business Logo</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                          {logoPreview ? (
                            <div className="relative">
                              <img src={logoPreview} alt="Logo preview" className="w-full h-32 object-contain mb-2" />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setBusinessLogo(null);
                                  setLogoPreview('');
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <label htmlFor="logo-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">Click to upload logo</p>
                              <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 2MB)</p>
                              <input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'logo')}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Store Banner</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                          {bannerPreview ? (
                            <div className="relative">
                              <img src={bannerPreview} alt="Banner preview" className="w-full h-32 object-cover mb-2 rounded" />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setBusinessBanner(null);
                                  setBannerPreview('');
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <label htmlFor="banner-upload" className="cursor-pointer">
                              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">Click to upload banner</p>
                              <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
                              <input
                                id="banner-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'banner')}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Password */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Account Security
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="seller-password">Password *</Label>
                        <Input
                          id="seller-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seller-confirm-password">Confirm Password *</Label>
                        <Input
                          id="seller-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    {password && (
                      <div className="space-y-2">
                        <Progress value={passwordStrength} className="h-2" />
                        <div className="grid grid-cols-3 gap-2">
                          {passwordRequirements.slice(0, 3).map((req, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-xs">
                              {req.met ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <X className="w-3 h-3 text-gray-300" />
                              )}
                              <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                                {req.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Benefits */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      Seller Benefits
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Package, text: 'Unlimited product listings' },
                        { icon: TrendingUp, text: 'Advanced analytics dashboard' },
                        { icon: Star, text: 'Featured seller badge' },
                        { icon: Zap, text: 'Priority customer support' },
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <benefit.icon className="w-4 h-4 text-purple-600" />
                          <span>{benefit.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                      I agree to the <span className="text-purple-600 font-medium">Seller Terms & Conditions</span>, 
                      <span className="text-purple-600 font-medium"> Privacy Policy</span>, and understand the 
                      commission structure and payment terms.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                    size="lg"
                  >
                    <Store className="w-5 h-5 mr-2" />
                    Create Seller Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-white text-sm mt-6">
          © 2024 Bako Marketplace. All rights reserved. | Secured with enterprise-grade encryption
        </p>
      </motion.div>
    </div>
  );
}
