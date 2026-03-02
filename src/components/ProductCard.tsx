import React from 'react';
import type { Product, Shop } from '../utils/database';
import { db } from '../utils/database';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, price: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="card-base card-hover overflow-hidden group">
      <div className="relative overflow-hidden h-56 bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs mb-1">Price</p>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product.id, product.price)}
              className="btn-primary text-sm py-2 px-3"
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ShopCardProps {
  shop: Shop;
  onViewProducts?: (shopId: string) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onViewProducts }) => {
  const rating = db.getShopRating(shop.id);
  const productCount = db.getProductsByShop(shop.id).length;

  return (
    <div className="card-base card-hover overflow-hidden group">
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-50"></div>
        {shop.is_verified && (
          <div className="absolute top-3 right-3 badge-success glow-effect z-10">
            ✓ Verified
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-1 text-gray-900 group-hover:text-blue-600 transition">{shop.name}</h3>
        <p className="text-xs text-gray-500 mb-3 capitalize">{shop.category}</p>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">{shop.description}</p>

        <div className="space-y-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>📍 {shop.location}</span>
            <span className="font-semibold">⭐ {rating > 0 ? `${rating}/5` : 'New'}</span>
          </div>
          <div>📦 {productCount} products</div>
        </div>

        <div className="flex gap-2">
          <a
            href={shop.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg text-center hover:shadow-lg transition font-semibold text-sm"
          >
            📸 Instagram
          </a>
          {onViewProducts && (
            <button
              onClick={() => onViewProducts(shop.id)}
              className="flex-1 btn-primary text-sm py-2"
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
