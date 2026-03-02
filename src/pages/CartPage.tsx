import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { db } from '../utils/database';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="heading-large mb-3">Your Cart is Empty</h1>
          <p className="text-gray-600 text-lg mb-8">Start shopping and fill your cart with amazing products from our verified sellers!</p>
          <Link
            to="/shops"
            className="btn-primary inline-block px-8 py-4 text-lg"
          >
            🛍️ Browse Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-large mb-2">🛒 Shopping Cart</h1>
          <p className="text-gray-600">You have {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card-base overflow-hidden divide-y">
              {cart.map((item) => {
                const product = db.getProduct(item.product_id);
                if (!product) return null;

                return (
                  <div
                    key={item.product_id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 hover:bg-gray-50 transition"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-gradient font-semibold">Rs. {product.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity - 1)
                        }
                        className="w-10 h-10 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-200 rounded transition"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity + 1)
                        }
                        className="w-10 h-10 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-200 rounded transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-24">
                      <p className="text-gray-600 text-sm mb-2">Subtotal</p>
                      <p className="font-bold text-lg">
                        Rs. {(product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="btn-danger px-4 py-2"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/shops"
                className="text-blue-600 hover:text-blue-800 font-semibold transition"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="h-fit">
            <div className="card-base p-6 sticky top-20">
              <h2 className="heading-small mb-6">📋 Order Summary</h2>

              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Items ({getTotalItems()})</span>
                  <span className="font-semibold">Rs. {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">🚚 Shipping</span>
                  <span className="badge-success">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">💰 Tax</span>
                  <span className="text-green-600 font-semibold">Included</span>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="heading-small">Total</span>
                  <span className="text-gradient text-2xl font-bold">
                    Rs. {getTotalPrice().toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary block w-full py-3 text-center font-bold text-lg mb-4"
              >
                Proceed to Checkout
              </Link>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <p className="font-semibold text-blue-900 mb-2">💳 Payment Method:</p>
                <p className="text-blue-800">Cash on Delivery</p>
                <p className="text-xs text-blue-700 mt-2">💡 Pay when your order arrives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
