import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'delivered'>('all');

  if (!user) {
    return <div>Not authenticated</div>;
  }

  const orders = db.getOrdersByUser(user.id);
  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✓';
      case 'delivered':
        return '🎁';
      case 'cancelled':
        return '✗';
      default:
        return '•';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-large mb-2">📦 My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-6 py-2 rounded-full font-semibold transition whitespace-nowrap ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => {
              const product = db.getProduct(order.product_id);

              return (
                <div key={order.id} style={{ animationDelay: `${index * 0.05}s` }} className="card-base p-6 hover:shadow-lg transition fade-in-up">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-mono">Order ID: {order.id.substring(0, 12)}...</p>
                      <p className="text-sm text-gray-600 mt-1">
                        📅 {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    {product && (
                      <>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">📦 Qty: {order.quantity}</p>
                          <p className="text-gradient font-bold text-lg">
                            Rs. {order.total.toLocaleString()}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <p className="text-sm">
                      <strong className="text-gray-700">📍 Delivery Address:</strong>
                      <span className="text-gray-600 ml-2">{order.customer_address}</span>
                    </p>
                    <p className="text-sm">
                      <strong className="text-gray-700">📞 Contact:</strong>
                      <span className="text-gray-600 ml-2">{order.customer_phone}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="heading-small mb-3 text-gray-600">No orders yet</p>
            <p className="text-gray-500 mb-6">Start shopping to place your first order</p>
            <a
              href="/shops"
              className="btn-primary inline-block px-8 py-3"
            >
              🛍️ Browse Shops
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
