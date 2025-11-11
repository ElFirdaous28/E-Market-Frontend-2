import React, { useState } from 'react';
import { Search, Bell, User, Home, Package, ShoppingCart, Users, BarChart3, Settings, Menu } from 'lucide-react';

export default function Test() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: 'Total Sales', value: '$45,231', change: '+20.1%', icon: ShoppingCart },
    { label: 'Total Orders', value: '1,234', change: '+15.3%', icon: Package },
    { label: 'Total Users', value: '8,549', change: '+8.2%', icon: Users },
    { label: 'Revenue', value: '$89,342', change: '+12.5%', icon: BarChart3 },
  ];

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', product: 'Wireless Headphones', amount: '$89.99', status: 'Completed' },
    { id: '#12346', customer: 'Jane Smith', product: 'Smart Watch', amount: '$199.99', status: 'Pending' },
    { id: '#12347', customer: 'Mike Johnson', product: 'Laptop Stand', amount: '$49.99', status: 'Processing' },
    { id: '#12348', customer: 'Sarah Wilson', product: 'USB Cable', amount: '$12.99', status: 'Completed' },
    { id: '#12349', customer: 'Tom Brown', product: 'Mouse Pad', amount: '$15.99', status: 'Shipped' },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 1234, revenue: '$89,234' },
    { name: 'Smart Watch', sales: 987, revenue: '$75,321' },
    { name: 'Laptop Stand', sales: 756, revenue: '$45,678' },
    { name: 'USB Cable', sales: 543, revenue: '$12,890' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 border-r border-gray-700 transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-xl">
              E
            </div>
            {sidebarOpen && <span className="text-xl font-semibold text-white">E-Market</span>}
          </div>

          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-emerald-500 rounded-lg text-white">
              <Home className="w-5 h-5" />
              {sidebarOpen && <span>Dashboard</span>}
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700 rounded-lg">
              <Package className="w-5 h-5" />
              {sidebarOpen && <span>Products</span>}
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
              {sidebarOpen && <span>Orders</span>}
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700 rounded-lg">
              <Users className="w-5 h-5" />
              {sidebarOpen && <span>Customers</span>}
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700 rounded-lg">
              <BarChart3 className="w-5 h-5" />
              {sidebarOpen && <span>Analytics</span>}
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-700 rounded-lg">
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span>Settings</span>}
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-96 bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative text-gray-400 hover:text-white">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-white">John Doe</div>
                  <div className="text-gray-400">Admin</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
            <p className="text-gray-400">Welcome back, John! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="text-emerald-500 text-sm font-medium">{stat.change}</span>
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="col-span-2 bg-gray-800 border border-gray-700 rounded-lg">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Order ID</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Customer</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Product</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Amount</th>
                      <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="px-6 py-4 text-sm text-white">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-white">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{order.product}</td>
                        <td className="px-6 py-4 text-sm text-white font-medium">{order.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Completed' ? 'bg-emerald-500 bg-opacity-20 text-emerald-500' :
                            order.status === 'Pending' ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' :
                            order.status === 'Processing' ? 'bg-blue-500 bg-opacity-20 text-blue-500' :
                            'bg-purple-500 bg-opacity-20 text-purple-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Top Products</h2>
              </div>
              <div className="p-6 space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white mb-1">{product.name}</h4>
                      <p className="text-xs text-gray-400">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-500">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}