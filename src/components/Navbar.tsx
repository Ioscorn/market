import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <nav className="bg-gradient-primary text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-3xl font-black text-white hover:text-blue-200 transition-all duration-300 flex items-center gap-2">
            <span className="text-4xl">📸</span> InstaShop
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'user' && (
                  <>
                    <Link
                      to="/shops"
                      className="hover:text-blue-200 transition"
                    >
                      Browse Shops
                    </Link>
                    <Link
                      to="/cart"
                      className="hover:text-blue-200 transition relative"
                    >
                      🛒 Cart
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/orders"
                      className="hover:text-blue-200 transition"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/messages"
                      className="hover:text-blue-200 transition"
                    >
                      💬 Messages
                    </Link>
                  </>
                )}

                {user?.role === 'shop_owner' && (
                  <>
                    <Link
                      to="/shop-dashboard"
                      className="hover:text-blue-200 transition"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/shop-products"
                      className="hover:text-blue-200 transition"
                    >
                      Products
                    </Link>
                    <Link
                      to="/shop-orders"
                      className="hover:text-blue-200 transition"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/messages"
                      className="hover:text-blue-200 transition"
                    >
                      💬 Messages
                    </Link>
                  </>
                )}

                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="hover:text-blue-200 transition"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/shops"
                      className="hover:text-blue-200 transition"
                    >
                      Verify Shops
                    </Link>
                    <Link
                      to="/admin/users"
                      className="hover:text-blue-200 transition"
                    >
                      Users
                    </Link>
                    <Link
                      to="/messages"
                      className="hover:text-blue-200 transition"
                    >
                      💬 Messages
                    </Link>
                  </>
                )}

                {/* User Menu */}
                <div className="flex items-center gap-3 border-l border-blue-400 pl-6">
                  <span className="text-sm">{user?.name}</span>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-100 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
