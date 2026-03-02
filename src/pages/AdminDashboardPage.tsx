import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <div>Not authorized</div>;
  }

  const shops = db.getAllShops();
  const users = db.getAllUsers();
  const orders = db.getAllOrders();
  const products = db.getAllProducts();

  const verifiedShops = shops.filter((s) => s.is_verified).length;
  const pendingShops = shops.filter((s) => !s.is_verified).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-large mb-2">⚙️ Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg bg-white shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Verified Shops</p>
            <p className="text-3xl font-bold text-green-600">{verifiedShops}</p>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Pending Verification</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingShops}</p>
          </div>
          <div className="p-6 rounded-lg bg-white shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-600">Rs. {totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/shops" className="card-base p-6 text-center hover:shadow-lg transition">
            <p className="text-4xl mb-3">🏪</p>
            <h3 className="text-xl font-bold mb-2">Manage Shops</h3>
            <p className="text-gray-600 mb-4">Verify or reject shop submissions</p>
            <div className="flex justify-center items-center gap-4 text-sm">
              <span className="text-gray-600">Pending: {pendingShops}</span>
              <span className="text-blue-600 font-bold">→</span>
            </div>
          </Link>

          <Link to="/admin/users" className="card-base p-6 text-center hover:shadow-lg transition">
            <p className="text-4xl mb-3">👥</p>
            <h3 className="text-xl font-bold mb-2">Manage Users</h3>
            <p className="text-gray-600 mb-4">View and manage user accounts</p>
            <div className="flex justify-center items-center gap-4 text-sm">
              <span className="text-gray-600">Total: {users.length}</span>
              <span className="text-blue-600 font-bold">→</span>
            </div>
          </Link>

          <Link to="/messages" className="card-base p-6 text-center hover:shadow-lg transition">
            <p className="text-4xl mb-3">💬</p>
            <h3 className="text-xl font-bold mb-2">Messages</h3>
            <p className="text-gray-600 mb-4">Chat with users and shop owners</p>
            <div className="flex justify-center items-center gap-4 text-sm">
              <span className="text-gray-600">View Messages</span>
              <span className="text-blue-600 font-bold">→</span>
            </div>
          </Link>
        </div>

        {/* Platform Overview */}
        <section className="card-base p-6">
          <h2 className="heading-small mb-4">Platform Overview</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Products</p>
              <p className="text-2xl font-bold text-blue-600">{products.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Orders</p>
              <p className="text-2xl font-bold text-green-600">{orders.length}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Order Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {orders.length > 0
                  ? Math.round(
                      ((orders.filter((o) => o.status === 'delivered').length / orders.length) * 100)
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
