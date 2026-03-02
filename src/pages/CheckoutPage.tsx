import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="heading-large mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some great products before checkout.</p>
          <button
            onClick={() => navigate('/shops')}
            className="btn-primary px-8 py-3"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.phone.length < 10) {
      alert('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    // Create orders for each item in cart
    const orderedProductIds: string[] = [];
    cart.forEach((item) => {
      const product = db.getProduct(item.product_id);
      if (product && user) {
        const orderId = db.addOrder({
          user_id: user.id,
          product_id: item.product_id,
          quantity: item.quantity,
          total: product.price * item.quantity,
          status: 'pending',
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
        });
        orderedProductIds.push(orderId);
      }
    });

    setOrderPlaced(true);
    clearCart();
    setTimeout(() => {
      navigate('/orders');
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold text-green-600 mb-2">Order Placed!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Thank you for your purchase. You will receive a confirmation shortly.
          </p>
          <p className="text-lg text-gray-600">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-large mb-2">🧾 Checkout</h1>
          <p className="text-gray-600">Confirm delivery details and place your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card-base p-6 space-y-6">
              <h2 className="heading-small">Delivery Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-base w-full"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-base w-full"
                  placeholder="9800000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-base w-full h-28"
                  placeholder="Enter your delivery address. Include landmarks if possible."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">Payment Method</h3>
                <p className="text-gray-700">💵 Cash on Delivery - Pay when your order arrives</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg font-semibold"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card-base p-6 sticky top-20">
              <h2 className="heading-small mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => {
                  const product = db.getProduct(item.product_id);
                  if (!product) return null;

                  return (
                    <div
                      key={item.product_id}
                      className="flex justify-between items-start text-sm"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-gray-600">{item.quantity} × Rs. {product.price}</p>
                      </div>
                      <p className="font-semibold text-gray-900">Rs. {(product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rs. {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="badge-success">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="text-green-600 font-semibold">Included</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="heading-small">Total</span>
                  <span className="text-gradient text-2xl font-bold">Rs. {getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
