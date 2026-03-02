import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

export const AdminShopsPage: React.FC = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('pending');

  if (!user || user.role !== 'admin') {
    return <div>Not authorized</div>;
  }

  const shops = db.getAllShops();
  const filteredShops =
    filter === 'all'
      ? shops
      : filter === 'pending'
      ? shops.filter((s) => !s.is_verified)
      : shops.filter((s) => s.is_verified);

  const handleApprove = (shopId: string) => {
    if (window.confirm('Approve this shop?')) {
      db.updateShop(shopId, { is_verified: true });
    }
  };

  const handleReject = (shopId: string) => {
    if (window.confirm('Are you sure you want to reject this shop? This cannot be undone.')) {
      // In a real app, we would mark it as rejected or delete it
      db.updateShop(shopId, { is_verified: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="heading-large mb-2">🏪 Manage Shops</h1>
          <p className="text-gray-600">Review and verify shop registrations</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8">
          {['all', 'pending', 'verified'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-5 py-2 rounded-full font-semibold transition ${
                filter === status ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              {status === 'all' ? 'All Shops' : status === 'pending' ? 'Pending' : 'Verified'}
            </button>
          ))}
        </div>

        {/* Shops List */}
        {filteredShops.length > 0 ? (
          <div className="space-y-6">
            {filteredShops.map((shop) => {
              const owner = db.getUser(shop.owner_id);
              const products = db.getProductsByShop(shop.id);
              const reviews = db.getReviewsByShop(shop.id);
              const rating = db.getShopRating(shop.id);

              return (
                <div key={shop.id} className="card-base p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">{shop.name}</h2>
                        <div className={shop.is_verified ? 'badge-success' : 'badge-warning'}>
                          {shop.is_verified ? '✓ Verified' : '⏳ Pending'}
                        </div>
                      </div>
                      <p className="text-gray-600">{shop.description}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="mb-1">ID: {shop.id.substring(0, 12)}...</p>
                      <p>Date: {new Date(shop.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Shop Details */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-gray-600 text-sm">Owner</p>
                      <p className="font-semibold">{owner?.name}</p>
                      <p className="text-xs text-gray-600">{owner?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Details</p>
                      <p className="font-semibold">📍 {shop.location}</p>
                      <p className="font-semibold">👕 {shop.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Stats</p>
                      <p className="font-semibold">⭐ {rating > 0 ? `${rating}/5` : 'No reviews'}</p>
                      <p className="font-semibold">📦 {products.length} products</p>
                    </div>
                  </div>

                  {/* Verification Details */}
                  <div className="bg-white border border-gray-100 rounded-lg p-4 mb-6">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Verification Info</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>
                        <strong>Instagram:</strong>{' '}
                        <a href={shop.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
                          {shop.instagram}
                        </a>
                      </li>
                      <li>
                        <strong>PAN Number:</strong> {shop.pan_number}
                      </li>
                      <li>
                        <strong>Reviews:</strong> {reviews.length} reviews
                      </li>
                    </ul>
                  </div>

                  {/* Recent Reviews */}
                  {reviews.length > 0 && (
                    <div className="mb-6">
                      <p className="font-semibold mb-2">Recent Reviews:</p>
                      <div className="space-y-2">
                        {reviews.slice(0, 3).map((review) => {
                          const reviewer = db.getUser(review.user_id);
                          return (
                            <div key={review.id} className="text-sm bg-gray-50 p-2 rounded">
                              <p className="font-semibold">{reviewer?.name} - {'⭐'.repeat(review.rating)}</p>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {!shop.is_verified && (
                    <div className="flex gap-3 pt-4 border-t">
                      <button onClick={() => handleApprove(shop.id)} className="btn-success flex-1">
                        ✓ Approve
                      </button>
                      <button onClick={() => handleReject(shop.id)} className="btn-danger flex-1">
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600 mb-4">{filter === 'pending' ? 'No pending shops' : 'No shops found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
