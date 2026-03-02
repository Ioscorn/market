import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-8 right-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="heading-large text-white mb-6">
            Welcome to InstaShop Nepal 📸
          </h1>
          <p className="text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Discover authentic Instagram-based clothing and accessory shops from Nepal.
            Shop directly from independent sellers with verified quality and fast delivery.
          </p>
          <div className="flex gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/signup"
                  className="btn-primary shadow-2xl hover:shadow-3xl"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary"
                >
                  Login
                </Link>
              </>
            ) : user?.role === 'user' ? (
              <>
                <Link
                  to="/shops"
                  className="btn-primary"
                >
                  Browse Shops
                </Link>
              </>
            ) : user?.role === 'shop_owner' ? (
              <>
                <Link
                  to="/shop-dashboard"
                  className="btn-primary"
                >
                  Shop Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin"
                  className="btn-primary"
                >
                  Admin Panel
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="heading-medium text-center mb-4 text-gray-900">Why Choose InstaShop?</h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">The best platform for connecting directly with local Instagram entrepreneurs</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-base card-hover p-8 fade-in-up">
              <div className="text-6xl mb-6">📱</div>
              <h3 className="heading-small mb-3 text-gray-900">Direct from Instagram</h3>
              <p className="text-gray-600">
                Shop directly from Instagram-based sellers. No middlemen, just authentic
                products from real shop owners.
              </p>
            </div>

            <div className="card-base card-hover p-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-6xl mb-6">✓</div>
              <h3 className="heading-small mb-3 text-gray-900">Verified Sellers</h3>
              <p className="text-gray-600">
                All sellers are verified by our team. Shop with confidence knowing you're
                buying from legitimate businesses.
              </p>
            </div>

            <div className="card-base card-hover p-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl mb-6">🚚</div>
              <h3 className="heading-small mb-3 text-gray-900">Easy Checkout</h3>
              <p className="text-gray-600">
                Simple checkout with Cash on Delivery option. No complicated payment
                processes. Shop freely.
              </p>
            </div>

            <div className="card-base card-hover p-8 fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-6xl mb-6">💬</div>
              <h3 className="heading-small mb-3 text-gray-900">Direct Chat</h3>
              <p className="text-gray-600">
                Chat directly with shop owners to ask questions, get recommendations, and
                track your orders.
              </p>
            </div>

            <div className="card-base card-hover p-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-6xl mb-6">⭐</div>
              <h3 className="heading-small mb-3 text-gray-900">True Reviews</h3>
              <p className="text-gray-600">
                Read genuine reviews from real customers. Rate and review shops and
                products to help others.
              </p>
            </div>

            <div className="card-base card-hover p-8 fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="text-6xl mb-6">🇳🇵</div>
              <h3 className="heading-small mb-3 text-gray-900">Support Local</h3>
              <p className="text-gray-600">
                Support local Nepali businesses directly. Every purchase helps small
                business owners grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-secondary text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="heading-medium mb-4">Ready to start shopping?</h2>
          <p className="text-xl mb-8">Join thousands of customers discovering authentic local brands</p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-block btn-primary"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};
