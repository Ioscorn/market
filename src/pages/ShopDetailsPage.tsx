import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../utils/database';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export const ShopDetailsPage: React.FC = () => {
  const { shopId } = useParams();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!shopId) {
    return <div>Shop not found</div>;
  }

  const shop = db.getShop(shopId);
  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl text-gray-600">Shop not found</p>
      </div>
    );
  }

  const products = db.getProductsByShop(shopId);
  const reviews = db.getReviewsByShop(shopId);
  const shopRating = db.getShopRating(shopId);

  const handleAddToCart = (productId: string, price: number) => {
    addToCart(productId, 1, price);
    alert('Product added to cart!');
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated || !user) {
      alert('Please login to submit a review');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }

    db.addReview({
      user_id: user.id,
      shop_id: shopId,
      rating,
      comment,
    });

    setComment('');
    setRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Shop Header */}
      <div className="card-base overflow-hidden text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">{shop.name}</h1>
                {shop.is_verified && (
                  <div className="badge-success">✓ Verified</div>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-4">{shop.description}</p>
              <div className="flex gap-6 text-sm text-gray-600">
                <span>📍 {shop.location}</span>
                <span className="capitalize">{shop.category}</span>
                <span>⭐ {shopRating > 0 ? `${shopRating}/5` : 'New'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={shop.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition"
              >
                📸 Follow
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Products Section */}
        <section className="mb-12">
          <h2 className="heading-small mb-6">Products</h2>
          {products.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="fade-in-up">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-lg">No products available yet.</p>
          )}
        </section>

        {/* Reviews Section */}
        <section className="space-y-6">
          <div className="card-base p-6">
            <h2 className="heading-small mb-4">Reviews & Ratings</h2>

            {/* Review Form */}
            {isAuthenticated && user?.role === 'user' && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Leave a Review</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="input-base w-48"
                    >
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Fair</option>
                      <option value={3}>3 - Good</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={5}>5 - Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="input-base w-full h-28"
                      placeholder="Share your experience with this shop..."
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleSubmitReview}
                      className="btn-primary"
                    >
                      Submit Review
                    </button>
                    {reviewSubmitted && (
                      <p className="text-green-600 font-semibold mt-2">Review submitted successfully!</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="card-base p-6">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const reviewer = db.getUser(review.user_id);
                return (
                  <div key={review.id} className="border-b pb-4 mb-4 last:mb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{reviewer?.name || 'Anonymous'}</p>
                        <p className="text-yellow-500">⭐ {'⭐'.repeat(review.rating)}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
