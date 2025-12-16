import { AppContext, Look } from "../App";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";

interface ShopTheLookProps {
  looks: Look[];
  context: AppContext;
}

export const ShopTheLook = ({ looks, context }: ShopTheLookProps) => {

  const handleAddLookToCart = (look: Look) => {
    look.products.forEach(product => {
      context.addToCart(product, 1);
    });
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold mb-6">Shop The Look</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {looks.map((look) => (
          <div key={look.id} className="border rounded-lg overflow-hidden group">
            <div className="relative">
              <img src={look.image} alt={look.title} className="w-full h-80 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-semibold mb-2">{look.title}</h3>
                <Button 
                  size="lg"
                  className="w-full transition-all duration-300 ease-in-out transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  onClick={() => handleAddLookToCart(look)}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop This Look
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};