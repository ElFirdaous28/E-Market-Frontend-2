import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { formatDistanceToNow } from 'date-fns';
import { Image, ShoppingBasket } from 'lucide-react';

export default function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const { userOrders, isLoading, deleteOrder, updateOrderStatus } = useOrders(status);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openModal = (order) => {
    setSelectedOrder(order);
    console.log(order);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const statusColors = {
    pending: 'text-yellow-600',
    shipped: ' text-blue-600',
    delivered: 'text-green-600',
    cancelled: 'ext-red-600',
  };
  return (
    <div className="w-3/5">
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-surface border border-border rounded-lg">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textMain mb-2">My Orders</h1>
          <p className="text-textMuted">Track, manage and view your order history</p>
        </div>

        {/* Filters */}
        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            {['', 'pending', 'shipped', 'delivered', 'cancelled'].map((option) => (
              <button
                key={option || 'all'}
                onClick={() => setStatus(option)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 capitalize
                                    ${
                                      status === option
                                        ? 'bg-primary text-white [text-shadow:0_0_2px_rgba(0,0,0,0.8)] shadow-md'
                                        : 'bg-background text-textMain hover:bg-background-hover border border-border'
                                    }`}
              >
                {option === '' ? 'All Orders' : option}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {isLoading && <p>Loading...</p>}

          {!isLoading && userOrders?.length === 0 && (
            <div className="text-center py-16">
              <ShoppingBasket className="w-24 h-24 mx-auto text-textMuted opacity-50 mb-4" />
              <h3 className="text-xl font-bold text-textMain mb-2">No orders yet</h3>
              <p className="text-textMuted mb-6">Start shopping to see your orders here</p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-primary text-textMain rounded-lg hover:bg-opacity-90 transition font-semibold"
              >
                Start Shopping
              </a>
            </div>
          )}

          {userOrders?.map((order) => (
            <div
              key={order._id}
              className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] border border-border overflow-y-auto hide-scrollbar"
            >
              {/* Order Header */}
              <div className="bg-background px-6 py-4 border-b border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-textMuted mb-1">DATE PLACED</p>
                    <p className="text-sm font-medium text-textMain capitalize">
                      {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-textMuted mb-1">PAID AMOUNT</p>
                    <p className="text-sm font-medium text-primary">
                      ${order.finalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-textMuted mb-1">STATUS</p>
                    <span
                      className={`text-sm font-medium inline-block py-1 rounded-full ${statusColors[order.status]}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="px-6 py-4 bg-background border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => openModal(order)}
                    className="px-6 py-2 bg-primary text-textMain rounded-lg hover:bg-opacity-90 transition font-normal [text-shadow:0_0_2px_rgba(0,0,0,0.8)]"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => updateOrderStatus({ id: order._id, newStatus: 'cancelled' })}
                    disabled={order.status !== 'pending'}
                    className={`px-6 py-2 border rounded-lg font-normal transition
                                            ${
                                              order.status === 'pending'
                                                ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                                                : 'border-gray-300 text-gray-400 cursor-not-allowed'
                                            }`}
                  >
                    Cancel Order
                  </button>

                  <button
                    onClick={() => deleteOrder(order._id)}
                    disabled={order.status !== 'delivered' && order.status !== 'cancelled'}
                    className={`px-6 py-2 border rounded-lg font-normal transition
                                            ${
                                              order.status === 'delivered' ||
                                              order.status === 'cancelled'
                                                ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                                                : 'border-gray-300 text-gray-400 cursor-not-allowed'
                                            }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-textMain">Order Details</h2>
                <p className="text-textMuted text-sm">Order #ORD-2024-001</p>
              </div>
              <button
                onClick={closeModal}
                className="text-textMuted hover:text-textMain-light dark:hover:text-textMain-dark"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Order Items */}
              <div className="bg-surface rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-textMain mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder?.items?.map((item) => (
                    <div
                      key={item._id}
                      className="bg-background rounded-lg flex items-center gap-4 p-4 border-b border-border"
                    >
                      <div className="bg-gray-200 w-24 h-24 rounded-lg flex items-center justify-center shrink-0">
                        {item?.productId?.primaryImage ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${item?.productId?.primaryImage}`}
                            className="w-20 h-20 object-cover rounded-lg"
                            alt={item.productId.title}
                          />
                        ) : (
                          <Image className="w-20 h-20 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-textMain mb-1">
                          {item?.productId?.title}
                        </h4>
                        <p className="text-sm text-textMuted mb-2">
                          {item?.productId?.description}
                        </p>
                        <p className="text-sm text-textMuted">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-textMain">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary & applied*/}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Applied Coupons */}
                {selectedOrder?.appliedCoupons?.length > 0 ? (
                  <div className="space-y-4 bg-surface border border-border rounded-lg p-6">
                    {selectedOrder.appliedCoupons.map((coupon) => (
                      <div
                        key={coupon._id}
                        className="border border-border rounded-lg p-4 bg-background"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold text-textMain">{coupon.code}</p>
                          </div>

                          <p className="font-bold text-primary">
                            -{coupon.type === 'percentage' ? '%' : '$'}
                            {coupon.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-background rounded-lg border border-border/50">
                    <p className="text-textMuted text-sm">
                      No promotional coupons were applied to this order.
                    </p>
                  </div>
                )}

                {/* order summray */}
                <div className="bg-surface border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-textMain mb-4">Payment Summary</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-textMain">
                      <span>Subtotal</span>
                      <span>${selectedOrder?.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-success-light dark:text-success-dark">
                      <span>Discount</span>
                      <span>
                        ${(selectedOrder?.totalAmount - selectedOrder?.finalAmount).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-textMain">
                      <span>Shipping</span>
                      <span>$10.00</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-textMain">Total</span>
                      <span className="text-2xl font-bold text-primary">$352.97</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
