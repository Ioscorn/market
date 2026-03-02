import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

export const ShopDashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'shop_owner') {
    return <div>Not authorized</div>;
  }

  const shops = db.getShopsByOwner(user.id);
  const shop = shops[0];

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🏪</div>
          <h1 className="heading-large mb-3">No Shop Registered</h1>
          <p className="text-gray-600 text-lg mb-8">Register your shop to start selling amazing products and reach customers!</p>
          <Link
            to="/shop-register"
            className="btn-primary inline-block px-8 py-4 text-lg"
          >
            Register Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const products = db.getProductsByShop(shop.id);
  const orders = db.getOrdersByShop(shop.id);
  const rating = db.getShopRating(shop.id);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalEarnings = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-large mb-2">🏪 Shop Dashboard</h1>
          <p className="text-gray-600">Manage your shop, view orders, and track performance</p>
        </div>

        {/* Shop Status */}
        <div className="card-base p-6 mb-8 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{shop.name}</h2>
            <p className="text-gray-600 mb-3">{shop.description}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>📍 {shop.location}</span>
              <span className="capitalize">{shop.category}</span>
              <span>⭐ {rating > 0 ? `${rating}/5` : 'New'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-4 py-2 rounded-full font-bold mb-4 ${shop.is_verified ? 'badge-success' : 'badge-warning'}`}>
              {shop.is_verified ? '✓ Verified' : '⏳ Pending Approval'}
            </div>
            <Link to="/shop-edit" className="btn-primary inline-block px-4 py-2 text-sm font-semibold">Edit Shop</Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-white border border-blue-100">
            <p className="text-gray-600 text-sm mb-2">Total Products</p>
            <p className="text-3xl font-bold text-blue-600">{products.length}</p>
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-r from-green-50 to-white border border-green-100">
            <p className="text-gray-600 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-green-600">{orders.length}</p>
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-r from-yellow-50 to-white border border-yellow-100">
            <p className="text-gray-600 text-sm mb-2">Pending Orders</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
          </div>
          <div className="p-6 rounded-lg bg-gradient-to-r from-purple-50 to-white border border-purple-100">
            <p className="text-gray-600 text-sm mb-2">Total Earnings</p>
            <p className="text-2xl font-bold text-purple-600">Rs. {totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="heading-small">Recent Orders</h2>
            <Link to="/shop-orders" className="text-blue-600 font-semibold">View All →</Link>
          </div>

          {orders.length > 0 ? (
            <div className="card-base overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => {
                    const product = db.getProduct(order.product_id);
                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm">{order.id.substring(0, 12)}...</td>
                        <td className="px-6 py-3 text-sm">{product?.name}</td>
                        <td className="px-6 py-3 text-sm">{order.quantity}</td>
                        <td className="px-6 py-3 text-sm">Rs. {order.total}</td>
                        <td className="px-6 py-3 text-sm"><span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{order.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No orders yet</p>
          )}
        </section>

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/shop-products" className="btn-primary p-6 text-center">
            <p className="text-3xl mb-2">📦</p>
            <h3 className="font-bold">Manage Products</h3>
            <p className="text-sm mt-2">Add, edit, or delete products</p>
          </Link>

          <Link to="/shop-orders" className="btn-success p-6 text-center">
            <p className="text-3xl mb-2">📋</p>
            <h3 className="font-bold">View Orders</h3>
            <p className="text-sm mt-2">Manage customer orders and status</p>
          </Link>

          <Link to="/messages" className="btn-primary p-6 text-center">
            <p className="text-3xl mb-2">💬</p>
            <h3 className="font-bold">Messages</h3>
            <p className="text-sm mt-2">Chat with customers and admin</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
