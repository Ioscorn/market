import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

export const ShopProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
  });

  if (!user || user.role !== 'shop_owner') {
    return <div>Not authorized</div>;
  }

  const shops = db.getShopsByOwner(user.id);
  const shop = shops[0];

  if (!shop) {
    return <div>Please register your shop first</div>;
  }

  const products = db.getProductsByShop(shop.id);

  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', image: '', description: '' });
    setShowForm(true);
  };

  const handleEditClick = (productId: string) => {
    const product = db.getProduct(productId);
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        description: product.description,
      });
      setEditingProduct(productId);
      setShowForm(true);
    }
  };

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

    if (!formData.name || !formData.price || !formData.image || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    if (editingProduct) {
      // Update product
      db.updateProduct(editingProduct, {
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description,
      });
    } else {
      // Add new product
      db.addProduct({
        shop_id: shop.id,
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description,
      });
    }

    setShowForm(false);
    setFormData({ name: '', price: '', image: '', description: '' });
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      db.deleteProduct(productId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Products</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + Add Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Premium Cotton T-Shirt"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Price (Rs.)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="599"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
                placeholder="Product description and details..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {products.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-blue-600 font-bold text-xl mb-4">
                  Rs. {product.price}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(product.id)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-2xl text-gray-600 mb-6">No products yet</p>
          <button
            onClick={handleAddClick}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  );
};
