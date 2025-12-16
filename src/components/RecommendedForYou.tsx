import { AppContext, Product } from "../App";
import { ProductCard } from "./ProductGrid";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { BrainCircuit } from 'lucide-react';

interface RecommendedForYouProps {
  recommendations: Product[];
  context: AppContext;
}

export const RecommendedForYou = ({ recommendations, context }: RecommendedForYouProps) => {
  if (!recommendations.length) {
    return null;
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto py-12 px-6 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold">Recommended For You</h2>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {recommendations.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
              <div className="p-1">
                <ProductCard
                  product={product}
                  onAddToCart={() => context.addToCart(product, 1)}
                  onToggleWishlist={() => context.toggleWishlist(product)}
                  onQuickView={() => context.setQuickViewProduct(product)}
                  isInWishlist={context.wishlist.some((p) => p.id === product.id)}
                  currency={context.currency}
                  onViewProduct={() => context.viewProduct(product)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  );
};