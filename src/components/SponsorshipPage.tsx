import { Crown, Zap, TrendingUp, Eye, Star, Check, ArrowRight, Sparkles, Target, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface SponsorshipPageProps {
  user: any;
  onBack: () => void;
}

export function SponsorshipPage({ user, onBack }: SponsorshipPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Boost',
      price: 49,
      duration: 'month',
      icon: Zap,
      color: 'blue',
      features: [
        'Featured badge on products',
        '2x visibility in search results',
        'Priority customer support',
        'Monthly analytics report',
        'Social media mentions (2/month)',
        'Basic homepage banner (1 week)'
      ],
      impressions: '50K+',
      ctr: '2.5%'
    },
    {
      id: 'pro',
      name: 'Pro Sponsor',
      price: 149,
      duration: 'month',
      icon: Star,
      color: 'purple',
      popular: true,
      features: [
        'Everything in Basic +',
        'Premium badge & verified checkmark',
        '5x visibility in search results',
        'Featured in Flash Deals section',
        'Homepage banner (2 weeks)',
        'Category page sponsorship',
        'Social media posts (8/month)',
        'Dedicated account manager',
        'Advanced analytics dashboard',
        'Email marketing campaign (1/month)'
      ],
      impressions: '250K+',
      ctr: '4.8%'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Partner',
      price: 499,
      duration: 'month',
      icon: Crown,
      color: 'gold',
      features: [
        'Everything in Pro +',
        'Exclusive partner badge',
        '10x visibility boost',
        'Permanent homepage presence',
        'All category sponsorships',
        'Custom landing page',
        'Video advertising slots',
        'Expo booth (premium location)',
        'Unlimited social media coverage',
        'Weekly performance reports',
        'Priority product listings',
        'Dedicated marketing team',
        'Custom promotional campaigns',
        'First access to new features'
      ],
      impressions: '1M+',
      ctr: '7.2%'
    }
  ];

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    toast.success('Proceeding to secure payment...');
    // Payment integration would go here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-8">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors mb-8"
          >
            ← Back to Marketplace
          </button>
          
          <div className="text-white max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full">Premium Advertising</span>
            </div>
            <h1 className="text-white mb-4">Grow Your Business with Bako Sponsorship</h1>
            <p className="text-xl text-white/90 mb-8">
              Reach millions of potential customers and boost your sales with our powerful advertising solutions
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-3xl font-bold mb-1">50M+</p>
                <p className="text-white/80">Monthly Visitors</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-3xl font-bold mb-1">2M+</p>
                <p className="text-white/80">Active Buyers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-3xl font-bold mb-1">180+</p>
                <p className="text-white/80">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-4">Choose Your Sponsorship Plan</h2>
          <p className="text-gray-600 text-lg">Select the perfect plan to amplify your brand presence</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-8 border-2 transition-all ${
                  plan.popular
                    ? 'border-purple-600 shadow-2xl scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full">
                    Most Popular
                  </div>
                )}

                <div className={`w-16 h-16 bg-${plan.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-8 h-8 text-${plan.color}-600`} />
                </div>

                <h3 className="mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/{plan.duration}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Impressions</span>
                    </div>
                    <p className="font-semibold">{plan.impressions}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">Avg. CTR</span>
                    </div>
                    <p className="font-semibold">{plan.ctr}</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg'
                      : 'border-2 border-gray-300 hover:border-purple-600 hover:text-purple-600'
                  }`}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="mt-20 grid grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-3">Increase Sales</h3>
            <p className="text-gray-600">
              Our sponsored sellers see an average of 300% increase in sales within the first month
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-3">Maximum Visibility</h3>
            <p className="text-gray-600">
              Get featured in prime positions across the marketplace with guaranteed impressions
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-3">Detailed Analytics</h3>
            <p className="text-gray-600">
              Track your ROI with comprehensive reports and insights on campaign performance
            </p>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-20">
          <h2 className="text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                  TC
                </div>
                <div>
                  <h4>TechCorp Electronics</h4>
                  <p className="text-gray-600">Pro Sponsor Member</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Within 2 months of sponsorship, our sales increased by 450% and we gained 12,000 new customers. The ROI has been incredible!"
              </p>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-purple-600 font-semibold">+450%</p>
                  <p className="text-gray-600">Sales Growth</p>
                </div>
                <div>
                  <p className="text-purple-600 font-semibold">12K+</p>
                  <p className="text-gray-600">New Customers</p>
                </div>
                <div>
                  <p className="text-purple-600 font-semibold">850%</p>
                  <p className="text-gray-600">ROI</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl">
                  FS
                </div>
                <div>
                  <h4>Fashion Studio</h4>
                  <p className="text-gray-600">Enterprise Partner</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The Enterprise plan gave us unprecedented visibility. We're now the #1 fashion brand on Bako with over 50K monthly orders."
              </p>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-purple-600 font-semibold">50K+</p>
                  <p className="text-gray-600">Monthly Orders</p>
                </div>
                <div>
                  <p className="text-purple-600 font-semibold">#1</p>
                  <p className="text-gray-600">Category Rank</p>
                </div>
                <div>
                  <p className="text-purple-600 font-semibold">2M+</p>
                  <p className="text-gray-600">Impressions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-12 text-center text-white">
          <h2 className="text-white mb-4">Ready to Supercharge Your Business?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of successful sellers who have transformed their business with Bako Sponsorship
          </p>
          <button className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:shadow-2xl transition-shadow">
            Start Your Free Trial
          </button>
          <p className="mt-4 text-white/80">No credit card required • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}
