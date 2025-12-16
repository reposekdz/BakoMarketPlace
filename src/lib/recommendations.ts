import { Product } from '../App';

interface RecommendationOptions {
  allProducts: Product[];
  recentlyViewed: Product[];
  cart: Product[];
  wishlist: Product[];
  user?: any;
  count: number;
}

// This is a mock recommendation engine. In a real-world scenario, this would
// be a sophisticated service involving machine learning models.
export const getRecommendedProducts = ({
  allProducts,
  recentlyViewed,
  cart,
  wishlist,
  user,
  count = 10,
}: RecommendationOptions): Product[] => {
  const scores: { [productId: string]: number } = {};
  const recommendedSet = new Set<string>();

  const addToScore = (productId: string, amount: number) => {
    scores[productId] = (scores[productId] || 0) + amount;
  };

  // Rule 1: Boost products from the same category as recently viewed items
  for (const product of recentlyViewed) {
    const category = Array.isArray(product.category) ? product.category[0] : product.category;
    allProducts
      .filter(p => (Array.isArray(p.category) ? p.category.includes(category) : p.category === category))
      .forEach(p => addToScore(p.id, 2));
  }

  // Rule 2: Boost products from the same market as items in the cart/wishlist
  const interestMarketIds = [...cart, ...wishlist].map(p => p.marketId).filter(Boolean);
  if (interestMarketIds.length > 0) {
      const randomMarketId = interestMarketIds[Math.floor(Math.random() * interestMarketIds.length)];
      allProducts
        .filter(p => p.marketId === randomMarketId)
        .forEach(p => addToScore(p.id, 3));
  }

  // Rule 3: Highly boost items from the same category as items in the cart
  for (const item of cart) {
      const category = Array.isArray(item.category) ? item.category[0] : item.category;
      allProducts
        .filter(p => (Array.isArray(p.category) ? p.category.includes(category) : p.category === category))
        .forEach(p => addToScore(p.id, 5));
  }

  // Rule 4: Add some trending/popular items for variety (higher rating & reviews)
   allProducts
    .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
    .slice(0, 20)
    .forEach(p => addToScore(p.id, 1));


  // Exclude items already viewed, in cart, or in wishlist
  const excludedIds = new Set([
    ...recentlyViewed.map(p => p.id),
    ...cart.map(p => p.id),
    ...wishlist.map(p => p.id),
  ]);

  const sortedRecommendations = Object.entries(scores)
    .filter(([productId]) => !excludedIds.has(productId))
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([productId]) => productId);

  // Fill remaining spots with popular items if recommendations are not enough
  const finalRecommendationIds = [...new Set([...sortedRecommendations, ...allProducts.sort((a,b) => b.reviews - a.reviews).map(p => p.id)])];

  const final = finalRecommendationIds
    .filter(id => !excludedIds.has(id))
    .slice(0, count)
    .map(id => allProducts.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);

    return final;
};
