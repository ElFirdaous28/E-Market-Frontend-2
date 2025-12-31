import { Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import React from 'react';

function Products({ products }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Add product to cart
  const handleAddToCart = (e, productId) => {
    e.preventDefault();
    addToCart.mutate({ productId, quantity: 1 });
  };

  return (
    <section className="w-11/12 mx-auto">
      <h2 className="text-3xl font-bold text-textMain mb-6">Products</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-x-4 gap-y-5">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="bg-surface rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-primary flex flex-col"
            >
              {/* Product Image */}
              <div className="bg-border aspect-square flex items-center justify-center overflow-hidden">
                {product.primaryImage ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${product.primaryImage}`}
                    loading="lazy"
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-16 h-16 text-gray-500" />
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1">
                <div>
                  <h3 className="text-lg font-semibold text-textMain capitalize">
                    {product.title}
                  </h3>
                  <p className="text-sm text-textMuted mt-1">
                    {product.description
                      ? product.description.length > 100
                        ? product.description.slice(0, 50) + '...'
                        : product.description
                      : 'No description available'}
                  </p>
                </div>

                {/* Price + Add to Cart at the bottom */}
                {(!user || user.role === 'user') && (
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-primary mt-4">
                      ${product.price?.toFixed(2) ?? 'N/A'}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, product._id)}
                      className="mt-4 border border-primary hover:bg-primary text-textMain text-sm px-2 py-1 rounded-full font-semibold transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-textMuted col-span-full text-center">No products available</p>
        )}
      </div>
    </section>
  );
}

export default React.memo(Products);