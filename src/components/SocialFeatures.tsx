import { useState } from 'react';
import { Heart, Share2, MessageCircle, UserPlus, Bell, Star, TrendingUp, Users, Award } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SocialFeaturesProps {
  sellerId: string;
  sellerName: string;
  productId?: string;
  productName?: string;
}

export function SocialFeatures({ sellerId, sellerName, productId, productName }: SocialFeaturesProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 500) + 100);
  const [hasLiked, setHasLiked] = useState(false);
  const [shares, setShares] = useState(Math.floor(Math.random() * 200) + 50);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? `Unfollowed ${sellerName}` : `Now following ${sellerName}`);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
      toast.success('Added to favorites!');
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    const shareData = {
      title: productName || sellerName,
      text: `Check out ${productName || sellerName} on Bako Marketplace!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
    setShares(shares + 1);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleFollow}
        className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
          isFollowing
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg'
        }`}
      >
        <UserPlus className="w-5 h-5" />
        {isFollowing ? 'Following' : 'Follow'}
      </button>

      <button
        onClick={handleLike}
        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
          hasLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Heart className={`w-5 h-5 ${hasLiked ? 'fill-red-600' : ''}`} />
        <span>{likes.toLocaleString()}</span>
      </button>

      <button
        onClick={handleShare}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
      >
        <Share2 className="w-5 h-5" />
        <span>{shares}</span>
      </button>

      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
        <Bell className="w-5 h-5" />
      </button>
    </div>
  );
}

// Seller Social Stats Component
export function SellerSocialStats({ sellerId }: { sellerId: string }) {
  const stats = {
    followers: Math.floor(Math.random() * 50000) + 1000,
    rating: (Math.random() * 0.5 + 4.5).toFixed(1),
    reviews: Math.floor(Math.random() * 5000) + 100,
    responseRate: 98,
    responseTime: '< 2 hours',
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
      <h3 className="text-gray-900 mb-4">Seller Reputation</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-5 h-5 text-purple-600" />
            <p className="text-2xl font-bold text-gray-900">{(stats.followers / 1000).toFixed(1)}K</p>
          </div>
          <p className="text-gray-600 text-sm">Followers</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
          </div>
          <p className="text-gray-600 text-sm">{stats.reviews.toLocaleString()} Reviews</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="w-5 h-5 text-green-600" />
            <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
          </div>
          <p className="text-gray-600 text-sm">{stats.responseTime}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 px-3 py-2 bg-purple-100 rounded-lg text-center">
          <p className="text-purple-700 font-medium text-sm">Top Rated Seller</p>
        </div>
        <div className="flex-1 px-3 py-2 bg-green-100 rounded-lg text-center">
          <p className="text-green-700 font-medium text-sm">Verified</p>
        </div>
      </div>
    </div>
  );
}

// Product Social Proof Component
export function ProductSocialProof({ productId }: { productId: string }) {
  const stats = {
    watching: Math.floor(Math.random() * 200) + 20,
    sold: Math.floor(Math.random() * 1000) + 100,
    trending: Math.random() > 0.7,
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2 text-gray-600">
        <Eye className="w-4 h-4" />
        <span>{stats.watching} watching</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <TrendingUp className="w-4 h-4" />
        <span>{stats.sold} sold</span>
      </div>
      {stats.trending && (
        <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 rounded-full">
          <TrendingUp className="w-4 h-4 text-orange-600" />
          <span className="text-orange-700 font-medium">Trending</span>
        </div>
      )}
    </div>
  );
}

function Eye({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}
