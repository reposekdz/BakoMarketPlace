import { MessageCircle, ThumbsUp, Search } from 'lucide-react';
import { useState } from 'react';

interface QA {
  id: string;
  userName: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  date: string;
  helpful: number;
}

const mockQAs: QA[] = [
  {
    id: '1',
    userName: 'Alex T.',
    question: 'Does this laptop support external GPU via Thunderbolt 4?',
    answer: 'Yes! The Thunderbolt 4 ports support external GPU enclosures. I\'ve been using it with an RTX 4090 eGPU and it works flawlessly.',
    answeredBy: 'Product Expert',
    date: '3 days ago',
    helpful: 89
  },
  {
    id: '2',
    userName: 'Maria L.',
    question: 'Can I upgrade the RAM later?',
    answer: 'Unfortunately, the RAM is soldered to the motherboard and cannot be upgraded. However, 16GB DDR5 is sufficient for most professional tasks.',
    answeredBy: 'TechGlobal Store',
    date: '1 week ago',
    helpful: 45
  },
  {
    id: '3',
    userName: 'David K.',
    question: 'What is the actual battery life with normal use?',
    answer: 'With mixed use (web browsing, documents, streaming), I get around 8-9 hours. With heavy tasks like video editing, it\'s closer to 5-6 hours.',
    answeredBy: 'Verified Buyer',
    date: '2 weeks ago',
    helpful: 67
  },
  {
    id: '4',
    userName: 'Jennifer S.',
    question: 'Is the keyboard comfortable for long typing sessions?',
    answer: 'Absolutely! The key travel is perfect and the backlit keyboard is great for working in low light. Very comfortable even after hours of typing.',
    answeredBy: 'Verified Buyer',
    date: '3 weeks ago',
    helpful: 34
  }
];

export function ProductQA() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h3 className="mb-4">Customer Questions & Answers</h3>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {mockQAs.map((qa) => (
          <div key={qa.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <MessageCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-gray-900">{qa.question}</p>
                </div>
                <p className="text-sm text-gray-600">
                  Asked by <span className="text-gray-900">{qa.userName}</span> • {qa.date}
                </p>
              </div>
            </div>

            {qa.answer ? (
              <div className="ml-8 pl-4 border-l-2 border-purple-200">
                <div className="flex items-start gap-2 mb-2">
                  <div className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                    {qa.answeredBy}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{qa.answer}</p>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({qa.helpful})</span>
                </button>
              </div>
            ) : (
              <div className="ml-8">
                <button className="text-purple-600 hover:text-purple-700 text-sm">
                  Be the first to answer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
        <h4 className="mb-4">Have a question?</h4>
        <p className="text-gray-600 mb-4">
          Get answers from the community and TechGlobal Store
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type your question here..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          />
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
}
