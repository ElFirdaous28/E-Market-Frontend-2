import { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useAdminStatistics } from '../../hooks/useAdminstatistics';

export const ProductManagement = () => {
  const { products, deleteProduct } = useAdminStatistics();

  const [editingId, setEditingId] = useState(null);
  const [_editRole, setEditRole] = useState('');

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditRole(user.role);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditRole('');
  };

  const handleDelete = (id) => {
    deleteProduct(id);
  };

  return (
    <main className="flex-1 p-4 md:p-6 overflow-auto w-full">
      {/* Header */}
      <div className="mb-4 md:mb-6 max-w-full">
        <h1 className="text-xl md:text-2xl font-bold text-color-surface mb-1">
          Products Management
        </h1>
        <p className="text-sm md:text-base text-gray-400">Manage Products</p>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 w-full">
        <div className="bg-gray-800  border border-gray-700 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs md:text-sm mb-1">Total Users</h3>
          <p className="text-xl md:text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs md:text-sm mb-1">Admins</h3>
          <p className="text-xl md:text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs md:text-sm mb-1">Seller</h3>
          <p className="text-xl md:text-2xl font-bold text-white">{users.filter(u => u.role === 'seller').length}</p>
        </div>
      </div> */}

      {/* Users Table */}
      <div className="bg-color-background border border-gray-700 rounded-lg w-full">
        <div className="p-4 md:p-6 border-b border-gray-700">
          <h2 className="text-base md:text-lg font-semibold text-color-surface">All Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  Title
                </th>
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  Description
                </th>
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  Price
                </th>
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  Stock
                </th>
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  categories
                </th>
                <th className="text-left text-xs md:text-sm font-medium text-gray-400 px-4 md:px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                >
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-color-surface font-medium">
                    {product.title}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-400">
                    {product.description}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-400">
                    {product.price}
                  </td>
                  {/* <td className="px-4 md:px-6 py-3 md:py-4">
                    {editingId === product._id ? (
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
                        product.role === 'admin' 
                          ? 'bg-purple-500 bg-opacity-20 text-white' 
                          : product.role === 'seller'
                          ? 'bg-blue-500 bg-opacity-20 text-white'
                          : 'bg-gray-500 bg-opacity-20 text-white'
                      }`}>
                        {product.price}
                      
                      </span>
                    )}
                  </td> */}
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-400">
                    {product.stock}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-400">
                    {product.categories.length > 0 ? (
                      product.categories.map((cat) => <span key={cat._id}>{cat.name}</span>)
                    ) : (
                      <span>null</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {editingId === product._id ? (
                        <>
                          <button
                            onClick={() => handleSave(product._id)}
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
                            onClick={() => handleEdit(product)}
                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                            title="Edit Role"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 bg-red-500 hover:bg-red-600 rounded transition-colors"
                            title="Delete Product"
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
  //  }
}
