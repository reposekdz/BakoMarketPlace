import { Star, ThumbsUp, Camera, CheckCircle, Filter } from 'lucide-react';
import { useState } from 'react';

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

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'John D.',
    rating: 5,
    date: '2 days ago',
    comment: 'Absolutely amazing laptop! The build quality is exceptional and the performance is outstanding. Perfect for video editing and gaming. The 4K display is gorgeous and the battery life exceeds expectations.',
    images: ['https://images.unsplash.com/photo-1759668358660-0d06064f0f84?w=200'],
    verified: true,
    helpful: 234,
    size: '512GB',
    color: 'Space Gray'
  },
  {
    id: '2',
    userName: 'Sarah M.',
    rating: 5,
    date: '5 days ago',
    comment: 'Best purchase I\'ve made this year! Super fast, great screen, and the keyboard feels premium. Shipping was quick and packaging was excellent.',
    verified: true,
    helpful: 156,
    size: '512GB',
    color: 'Silver'
  },
  {
    id: '3',
    userName: 'Mike R.',
    rating: 4,
    date: '1 week ago',
    comment: 'Great laptop overall. Only minor issue is the fans can get a bit loud under heavy load, but the performance more than makes up for it.',
    verified: true,
    helpful: 89,
    size: '1TB',
    color: 'Space Gray'
  },
  {
    id: '4',
    userName: 'Emily Chen',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Perfect for work and creative projects. The Thunderbolt 4 ports are super convenient. Highly recommend!',
    images: ['https://images.unsplash.com/photo-1759668358660-0d06064f0f84?w=200', 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?w=200'],
    verified: true,
    helpful: 203
  }
];

export function ProductReviews() {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('helpful');

  const ratingDistribution = [
    { stars: 5, count: 2145, percentage: 75 },
    { stars: 4, count: 543, percentage: 19 },
    { stars: 3, count: 115, percentage: 4 },
    { stars: 2, count: 29, percentage: 1 },
    { stars: 1, count: 15, percentage: 1 }
  ];

  return (
    <div className="max-w-6xl">
      {/* Rating Summary */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="col-span-1">
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
              4.8
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">Based on 2,847 reviews</p>
          </div>
        </div>

        <div className="col-span-2">
          <h4 className="mb-4">Rating Distribution</h4>
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <button
                key={item.stars}
                onClick={() => setFilterRating(filterRating === item.stars ? null : item.stars)}
                className={`w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded transition-colors ${
                  filterRating === item.stars ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center gap-1 w-20">
                  <span>{item.stars}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-16 text-gray-600">{item.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter & Sort */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-purple-600 transition-colors">
              With Images
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-purple-600 transition-colors">
              Verified Purchase
            </button>
          </div>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
        >
          <option value="helpful">Most Helpful</option>
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.verified && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
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
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {review.size && review.color && (
              <div className="flex gap-4 mb-3 text-sm text-gray-600">
                <span>Size: <span className="text-gray-900">{review.size}</span></span>
                <span>Color: <span className="text-gray-900">{review.color}</span></span>
              </div>
            )}

            <p className="text-gray-700 mb-3 leading-relaxed">{review.comment}</p>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {review.images.map((image, index) => (
                  <div key={index} className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">Helpful ({review.helpful})</span>
              </button>
              <button className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
          Load More Reviews
        </button>
      </div>

      {/* Write Review */}
      <div className="mt-12 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
        <h4 className="mb-4">Share Your Experience</h4>
        <p className="text-gray-600 mb-4">Help other customers by writing a review</p>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
          Write a Review
        </button>
      </div>
    </div>
  );
}
