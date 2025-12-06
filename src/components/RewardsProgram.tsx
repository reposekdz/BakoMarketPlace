import { Award, Gift, Star, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';

interface RewardsProgramProps {
  points: number;
}

export function RewardsProgram({ points }: RewardsProgramProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const nextTierPoints = 2000;
  const progress = (points / nextTierPoints) * 100;

  return (
    <>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-full shadow-2xl hover:scale-110 transition-transform z-40 flex items-center gap-2"
      >
        <Award className="w-5 h-5" />
        <span>{points} pts</span>
      </button>

      {isExpanded && (
        <div className="fixed bottom-40 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-40">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              <h3>Rewards Program</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Your Points</span>
                <span className="text-purple-600">{points} pts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {nextTierPoints - points} points to Gold tier
              </p>
            </div>

            <div>
              <h4 className="mb-3">Redeem Points</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-500 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <div>
                      <p>$5 Off</p>
                      <p className="text-sm text-gray-600">500 points</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
                    Redeem
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-500 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <div>
                      <p>$10 Off</p>
                      <p className="text-sm text-gray-600">900 points</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
                    Redeem
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg opacity-50">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-gray-400" />
                    <div>
                      <p>Free Shipping (Month)</p>
                      <p className="text-sm text-gray-600">1,500 points</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Locked</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h4>Earn More Points</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Make a purchase: 10 pts per $1</li>
                <li>• Write a review: 50 pts</li>
                <li>• Refer a friend: 500 pts</li>
                <li>• Daily login: 10 pts</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
