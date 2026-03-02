import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'shop_owner',
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (signup(formData.name, formData.email, formData.password, formData.role)) {
      navigate('/');
    } else {
      setError('Email already exists. Please use a different email.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative card-base shadow-2xl w-full max-w-md fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 glow-effect">📸</h1>
          <h2 className="heading-large text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
            InstaShop Nepal
          </h2>
          <p className="text-gray-400 mt-2">Join our growing marketplace community</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 font-semibold mb-2 text-sm">Full Name</label>
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
            <label className="block text-gray-300 font-semibold mb-2 text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-base w-full"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2 text-sm">Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-base w-full bg-gray-800 cursor-pointer"
            >
              <option value="user">👤 Customer (Browse & Buy)</option>
              <option value="shop_owner">🏪 Shop Owner (Sell Products)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-base w-full"
              placeholder="Create a strong password"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2 text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-base w-full"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full font-semibold text-lg py-3 mt-6"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
