import { Star, ThumbsUp, Camera, CheckCircle, Filter } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  size?: string;
  color?: string;
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('helpful');
  const [showWithImages, setShowWithImages] = useState(false);
  const [showVerified, setShowVerified] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`/api/v1/products/${productId}/reviews`);
        setReviews(data.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [productId]);

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    if (filterRating) {
      filtered = filtered.filter(review => Math.floor(review.rating) === filterRating);
    }

    if (showWithImages) {
      filtered = filtered.filter(review => review.images && review.images.length > 0);
    }

    if (showVerified) {
      filtered = filtered.filter(review => review.verified);
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
        default:
          return b.helpful - a.helpful;
      }
    });
  }, [reviews, filterRating, sortBy, showWithImages, showVerified]);

  const ratingDistribution = useMemo(() => {
    const distribution = reviews.reduce((acc, review) => {
      const rating = Math.floor(review.rating);
      if (!acc[rating]) {
        acc[rating] = { stars: rating, count: 0, percentage: 0 };
      }
      acc[rating].count++;
      return acc;
    }, {} as { [key: number]: { stars: number, count: number, percentage: number } });

    const totalReviews = reviews.length;
    Object.values(distribution).forEach(item => {
      item.percentage = totalReviews > 0 ? (item.count / totalReviews) * 100 : 0;
    });
    return distribution;
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  }, [reviews]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-1">
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">Based on {reviews.length} reviews</p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <h4 className="mb-4 text-lg font-medium">Rating Distribution</h4>
          <div className="space-y-3">
            {Object.values(ratingDistribution).sort((a, b) => b.stars - a.stars).map((item) => (
              <button
                key={item.stars}
                onClick={() => setFilterRating(filterRating === item.stars ? null : item.stars)}
                className={`w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors ${
                  filterRating === item.stars ? 'bg-purple-50 border-purple-300' : ''
                }`}
              >
                <div className="flex items-center gap-1 w-20 text-sm">
                  <span>{item.stars}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-500 h-3 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-16 text-gray-600 text-sm">{item.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter & Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <Filter className="w-5 h-5 text-gray-600" />
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setShowWithImages(!showWithImages)}
              className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                showWithImages ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 hover:border-purple-600'
              }`}>
              With Images
            </button>
            <button 
              onClick={() => setShowVerified(!showVerified)}
              className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                showVerified ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-300 hover:border-purple-600'
              }`}>
              Verified Purchase
            </button>
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
        >
          <option value="helpful">Most Helpful</option>
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {filteredAndSortedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-8 last:border-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.verified && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs mt-1 sm:mt-0">
                        <CheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {review.size && review.color && (
              <div className="flex gap-4 mb-3 text-sm text-gray-600">
                <span>Size: <span className="font-medium text-gray-900">{review.size}</span></span>
                <span>Color: <span className="font-medium text-gray-900">{review.color}</span></span>
              </div>
            )}

            <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-3 mb-4 flex-wrap">
                {review.images.map((image, index) => (
                  <div key={index} className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={image} alt={`Review image ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors text-sm">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
              <button className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-10">
        <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors">
          Load More Reviews
        </button>
      </div>

      {/* Write Review */}
      <div className="mt-12 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:p-8">
        <h4 className="text-xl font-bold mb-2">Share Your Experience</h4>
        <p className="text-gray-600 mb-6">Help other customers by writing a review of this product.</p>
        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:shadow-xl transition-shadow">
          Write a Review
        </button>
      </div>
    </div>
  );
}
