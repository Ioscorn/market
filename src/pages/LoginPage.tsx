import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (login(email, password)) {
      navigate('/');
    } else {
      setError('Invalid email or password');
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
          <p className="text-gray-400 mt-2">Welcome back! Login to continue</p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 font-semibold mb-2 text-sm">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base w-full"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base w-full"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full font-semibold text-lg py-3 mt-6"
          >
            Login to InstaShop
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition">
            Create one now
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-blue-900/40 rounded-lg border border-blue-400/30">
          <p className="text-sm font-semibold text-blue-300 mb-3">🔐 Demo Credentials:</p>
          <div className="space-y-2 text-xs text-gray-300">
            <p className="flex items-center"><span className="mr-2">👤</span> User: john@example.com / user123</p>
            <p className="flex items-center"><span className="mr-2">🏪</span> Shop: ravi@instashop.np / shop123</p>
            <p className="flex items-center"><span className="mr-2">⚙️</span> Admin: admin@instashop.np / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
