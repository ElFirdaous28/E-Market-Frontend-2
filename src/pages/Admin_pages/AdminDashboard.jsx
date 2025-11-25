import {
  Search,
  Bell,
  User,
  Package,
  Users,
  BarChart3,
  Settings,
  Menu,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import { useAdminStatistics } from "../../hooks/useAdminstatistics";
export const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { recentOrders } = useOrders();
  const { topProducts, statics } = useAdminStatistics();

  const stats = [
    {
      label: "Total Sales",
      value: statics?.totalSales ?? 0,
      icon: ShoppingCart,
    },
    { label: "Total Orders", value: statics?.totalOrders ?? 0, icon: Package },
    { label: "Total Users", value: statics?.totalUsers ?? 0, icon: Users },
    { label: "Revenue", value: statics?.totalRevenue ?? 0, icon: BarChart3 },
  ];

  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">
          Welcome back, John! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {stats?.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white-500" />
                </div>
                {/* <span className="text-emerald-500 text-sm font-medium">
                  {stat.change}
                </span> */}
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
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">
                    Order
                  </th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">
                    Customer
                  </th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">
                    Product
                  </th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">
                    Amount
                  </th>
                  <th className="text-left text-sm font-medium text-gray-400 px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((order, index) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-700 hover:bg-gray-750"
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {order.userId?.fullname}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {order.items.map((i) => i.productId?.title).join(", ") ||
                        "product"}
                    </td>

                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {order.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-emerald-500 bg-opacity-20 text-white-500"
                            : order.status === "Pending"
                            ? "bg-yellow-500 bg-opacity-20 text-white-500"
                            : order.status === "Processing"
                            ? "bg-blue-500 bg-opacity-20 text-white-500"
                            : "bg-purple-500 bg-opacity-20 text-white-500"
                        }`}
                      >
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
            {topProducts?.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white mb-1">
                    {product.title}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {product.totalSold} sales
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-500">
                    {product.totalRevenue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
