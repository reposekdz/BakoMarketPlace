import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../App';
import { useTranslation } from 'react-i18next';

interface ProductDetailsProps {
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetails({ onAddToCart }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="lg:col-span-1">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-center object-cover" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
          <div className="mt-3">
            <h2 className="sr-only">{t('product_information')}</h2>
            <p className="text-3xl text-gray-900">${product.price}</p>
          </div>
          <div className="mt-6">
            <h3 className="sr-only">{t('reviews')}</h3>
            <div className="flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Star
                    key={rating}
                    className={`${product.rating > rating ? 'text-yellow-400' : 'text-gray-300'} h-5 w-5 flex-shrink-0`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="sr-only">{product.rating} {t('out_of_5_stars')}</p>
              <a href="#reviews" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {product.reviews} {t('reviews')}
              </a>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="sr-only">{t('description')}</h3>
            <div className="text-base text-gray-700 space-y-6" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
          </div>
          <div className="mt-10">
            <div className="flex items-center">
              <h3 className="text-sm text-gray-900 font-medium">{t('quantity')}</h3>
              <select
                id="quantity"
                name="quantity"
                className="ml-4 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[...Array(product.stock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row">
              <button
                type="button"
                className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-full mb-4 sm:mb-0 sm:mr-4"
                onClick={() => onAddToCart(product, quantity)}
              >
                <ShoppingCart className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                {t('add_to_cart')}
              </button>
              <button
                type="button"
                className="py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <Heart className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                <span className="sr-only">{t('add_to_wishlist')}</span>
              </button>
            </div>
          </div>
          <div className="mt-6 text-center">
            <div className="group inline-flex text-sm text-gray-500 hover:text-gray-700">
              <Truck className="h-5 w-5 mr-2 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              <span>{t('free_shipping_on_orders_over', { amount: 50 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
