import React, { useState } from 'react';
import { Users, Trash2, Edit2, Check, X } from 'lucide-react';

export const UserManagement = () => {
   const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Seller' },
    { id: 3, name: 'Mike Johnson', email: 'mike.j@example.com', role: 'User' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.w@example.com', role: 'User' },
    { id: 5, name: 'Tom Brown', email: 'tom.brown@example.com', role: 'Seller' },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('');

  const roles = ['Admin', 'Seller', 'User'];

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditRole(user.role);
  };

  const handleSave = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, role: editRole } : user
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditRole('');
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <main className="flex-1 p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Users Management</h1>
        <p className="text-gray-400">Manage user roles and permissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Users</h3>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Admins</h3>
          <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'Admin').length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Managers</h3>
          <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'Manager').length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Name</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Email</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Role</th>
                <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Admin' 
                          ? 'bg-purple-500 bg-opacity-20 text-white' 
                          : user.role === 'Manager'
                          ? 'bg-blue-500 bg-opacity-20 text-white'
                          : 'bg-gray-500 bg-opacity-20 text-white'
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {editingId === user.id ? (
                        <>
                          <button
                            onClick={() => handleSave(user.id)}
                            className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                            title="Edit Role"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
