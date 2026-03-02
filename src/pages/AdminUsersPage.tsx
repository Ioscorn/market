import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../utils/database';

export const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'all' | 'user' | 'shop_owner' | 'admin'>('all');

  if (!user || user.role !== 'admin') {
    return <div>Not authorized</div>;
  }

  const users = db.getAllUsers();
  const filteredUsers =
    selectedRole === 'all'
      ? users
      : users.filter((u) => u.role === selectedRole);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'shop_owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'user':
        return '👤';
      case 'shop_owner':
        return '🏪';
      case 'admin':
        return '⚙️';
      default:
        return '•';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="heading-large mb-2">👥 Manage Users</h1>
          <p className="text-gray-600">View and filter platform users</p>
        </div>

        {/* Role Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'user', 'shop_owner', 'admin'].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role as any)}
              className={`px-4 py-2 rounded-full font-semibold transition whitespace-nowrap ${
                selectedRole === role ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              {role === 'all' ? 'All Users' : role === 'user' ? 'Customers' : role === 'shop_owner' ? 'Shop Owners' : 'Admins'}
            </button>
          ))}
        </div>

        {/* User Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-base p-4 text-center">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="card-base p-4 text-center">
            <p className="text-gray-600 text-sm">Customers</p>
            <p className="text-2xl font-bold text-blue-600">{users.filter((u) => u.role === 'user').length}</p>
          </div>
          <div className="card-base p-4 text-center">
            <p className="text-gray-600 text-sm">Shop Owners</p>
            <p className="text-2xl font-bold text-purple-600">{users.filter((u) => u.role === 'shop_owner').length}</p>
          </div>
          <div className="card-base p-4 text-center">
            <p className="text-gray-600 text-sm">Admins</p>
            <p className="text-2xl font-bold text-red-600">{users.filter((u) => u.role === 'admin').length}</p>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <div className="card-base overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Activity</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((usr) => {
                  const orders = db.getOrdersByUser(usr.id);
                  const shops = db.getShopsByOwner(usr.id);

                  return (
                    <tr key={usr.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-semibold">{usr.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{usr.email}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(usr.role)}`}>
                          {getRoleIcon(usr.role)} {usr.role === 'user' ? 'Customer' : usr.role === 'shop_owner' ? 'Shop Owner' : 'Admin'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{new Date(usr.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3 text-sm">
                        {usr.role === 'user' ? (
                          <p className="text-gray-600">📦 {orders.length} orders</p>
                        ) : usr.role === 'shop_owner' ? (
                          <>
                            <p className="text-gray-600">🏪 {shops.length} shop(s)</p>
                            {shops.length > 0 && (
                              <p className="text-xs text-gray-500">{shops[0].is_verified ? '✓ Verified' : '⏳ Pending'}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-600">⚙️ Admin</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};
