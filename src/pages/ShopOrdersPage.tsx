import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

export const ShopOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'delivered'>('all');

  if (!user || user.role !== 'shop_owner') {
    return <div>Not authorized</div>;
  }

  const shops = db.getShopsByOwner(user.id);
  const shop = shops[0];

  if (!shop) {
    return <div>Please register your shop first</div>;
  }

  const orders = db.getOrdersByShop(shop.id);
  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    db.updateOrder(orderId, { status: newStatus as any });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Manage Orders</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {['all', 'pending', 'confirmed', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Qty</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const product = db.getProduct(order.product_id);

                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-mono">
                      {order.id.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-3 text-sm">{product?.name}</td>
                    <td className="px-6 py-3 text-sm">
                      <div>
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-xs text-gray-600">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm">{order.quantity}</td>
                    <td className="px-6 py-3 text-sm font-bold">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-2xl text-gray-600">No orders found</p>
        </div>
      )}

      {/* Order Summary Cards */}
      {orders.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-l-yellow-600">
              <p className="text-gray-600 text-sm mb-1">Pending Orders</p>
              <p className="text-3xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === 'pending').length}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-l-blue-600">
              <p className="text-gray-600 text-sm mb-1">Confirmed Orders</p>
              <p className="text-3xl font-bold text-blue-600">
                {orders.filter((o) => o.status === 'confirmed').length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-l-green-600">
              <p className="text-gray-600 text-sm mb-1">Delivered Orders</p>
              <p className="text-3xl font-bold text-green-600">
                {orders.filter((o) => o.status === 'delivered').length}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-l-purple-600">
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">
                Rs. {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
