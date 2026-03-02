import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { BrowseShopsPage } from './pages/BrowseShopsPage';
import { ShopDetailsPage } from './pages/ShopDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { MessagesPage } from './pages/MessagesPage';
import { ShopRegistrationPage } from './pages/ShopRegistrationPage';
import { ShopDashboardPage } from './pages/ShopDashboardPage';
import { ShopProductsPage } from './pages/ShopProductsPage';
import { ShopOrdersPage } from './pages/ShopOrdersPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminShopsPage } from './pages/AdminShopsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';

function App() {
  // use basename when running on GitHub Pages under /market
  // (project repo is 'market', not 'market2')
  const basename = import.meta.env.PROD ? '/market' : '/';

  return (
    <Router basename={basename}>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/shops" element={<BrowseShopsPage />} />
                <Route path="/shop/:shopId" element={<ShopDetailsPage />} />

                {/* Customer Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute requiredRole="user">
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute requiredRole="user">
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute requiredRole="user">
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />

                {/* Shop Owner Routes */}
                <Route
                  path="/shop-register"
                  element={
                    <ProtectedRoute requiredRole="shop_owner">
                      <ShopRegistrationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shop-dashboard"
                  element={
                    <ProtectedRoute requiredRole="shop_owner">
                      <ShopDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shop-products"
                  element={
                    <ProtectedRoute requiredRole="shop_owner">
                      <ShopProductsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shop-orders"
                  element={
                    <ProtectedRoute requiredRole="shop_owner">
                      <ShopOrdersPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/shops"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminShopsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />

                {/* Messages (Protected for all authenticated users) */}
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="mb-2">
                  © 2024 InstaShop Nepal - Supporting Local Instagram Businesses
                </p>
                <p className="text-gray-400 text-sm">
                  This is a demo application showcasing a full-stack marketplace platform.
                </p>
              </div>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
