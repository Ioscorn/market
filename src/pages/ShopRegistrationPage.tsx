import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

export const ShopRegistrationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: 'clothes' as 'clothes' | 'accessories',
    instagram: '',
    location: '',
    description: '',
    pan_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'shop_owner') {
    return <div>Not authorized</div>;
  }

  const existingShop = db.getShopsByOwner(user.id)[0];
  if (existingShop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">Shop Already Registered</h1>
          <p className="text-blue-800 mb-4">
            You have already registered a shop. Navigate to your dashboard to manage it.
          </p>
          <a
            href="/shop-dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (
      !formData.name ||
      !formData.instagram ||
      !formData.location ||
      !formData.description ||
      !formData.pan_number
    ) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!formData.instagram.includes('instagram.com')) {
      setError('Please enter a valid Instagram URL');
      setLoading(false);
      return;
    }

    if (formData.pan_number.length < 9) {
      setError('Please enter a valid PAN number');
      setLoading(false);
      return;
    }

    // Create shop
    db.addShop({
      owner_id: user.id,
      name: formData.name,
      category: formData.category,
      instagram: formData.instagram,
      location: formData.location,
      description: formData.description,
      pan_number: formData.pan_number,
      is_verified: false,
    });

    setTimeout(() => {
      navigate('/shop-dashboard');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Register Your Shop</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Shop Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="e.g., Trendy Threads Nepal"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="clothes">Clothes</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g., Kathmandu"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Instagram Profile Link</label>
          <input
            type="url"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="https://instagram.com/yourshop"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">PAN Number (Tax ID)</label>
          <input
            type="text"
            name="pan_number"
            value={formData.pan_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter your PAN number (Min 9 digits)"
          />
          <p className="text-xs text-gray-600 mt-1">Required for shop verification</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Shop Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows={5}
            placeholder="Describe your shop, products, and what makes you unique..."
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> Your shop will be submitted for verification. Our team will
            review your details and PAN number before your shop goes live.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register Shop'}
        </button>
      </form>
    </div>
  );
};
