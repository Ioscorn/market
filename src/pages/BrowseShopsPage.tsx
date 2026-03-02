import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/database';
import { ShopCard } from '../components/ProductCard';

export const BrowseShopsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clothes' | 'accessories'>('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  const shops = db.getVerifiedShops();
  
  const filteredShops = shops.filter((shop) => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || shop.category === selectedCategory;
    const matchesLocation = !selectedLocation || shop.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const locations = [...new Set(shops.map((s) => s.location))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="heading-large mb-2">🛍️ Browse Verified Shops</h1>
          <p className="text-gray-600 text-lg">Discover verified sellers and explore their amazing products</p>
        </div>

        {/* Filters */}
        <div className="card-base p-6 mb-8 shadow-md">
          <h2 className="heading-small mb-4">🔍 Find Shops</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Shop name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-base w-full"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="input-base w-full"
              >
                <option value="all">All Categories</option>
                <option value="clothes">Clothes</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="input-base w-full"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <div className="flex items-end">
              <div className="py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg w-full text-center">
                <p className="text-white font-semibold">{filteredShops.length} shops</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shops Grid */}
        {filteredShops.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredShops.map((shop, index) => (
              <div key={shop.id} style={{ animationDelay: `${index * 0.1}s` }} className="fade-in-up">
                <ShopCard
                  shop={shop}
                  onViewProducts={() => navigate(`/shop/${shop.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="heading-small mb-4 text-gray-600">No shops found</p>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLocation('');
              }}
              className="btn-primary px-8 py-3"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
