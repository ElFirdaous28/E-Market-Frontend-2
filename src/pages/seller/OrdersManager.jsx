import { useSellerOrders } from '../../hooks/useSellerOrders';

const STATUS_OPTIONS = ['pending', 'shipped', 'delivered', 'cancelled'];

function statusBadge(status) {
  const base = 'px-2 py-0.5 rounded text-xs font-medium capitalize';
  switch (status) {
    case 'pending':
      return base + ' bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300';
    case 'shipped':
      return base + ' bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300';
    case 'delivered':
      return base + ' bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300';
    case 'cancelled':
      return base + ' bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-300';
    default:
      return base + ' bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-300';
  }
}

export default function OrdersManager() {
  const { ordersQuery, updateStatus, statusUpdating } = useSellerOrders();

  const isLoading = ordersQuery.isLoading || statusUpdating;
  const orders = ordersQuery.data || [];
  if (ordersQuery.isLoading) return <div>Chargement commandes...</div>;
  if (ordersQuery.isError)
    return <div className="text-red-600">Erreur: {ordersQuery.error?.message}</div>;

  const handleStatusChange = (order, newStatus) => {
    updateStatus(order._id, newStatus, order.status);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Commandes liées à vos produits</h2>
        {isLoading && <span className="text-sm text-gray-500">Mise à jour...</span>}
      </div>
      {orders.length === 0 && (
        <div className="text-sm text-gray-600">Aucune commande pour l&aposinstant.</div>
      )}
      {orders.length > 0 && (
        <div className="overflow-x-auto border rounded-lg shadow-sm bg-white dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr className="text-left">
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Commande</th>
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Client</th>
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Produits</th>
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">
                  Total (vous)
                </th>
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Statut</th>
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Date</th>
                <th className="px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Changer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.map((order) => {
                const productTitles =
                  order.items?.map((it) => it.productId?.title).filter(Boolean) || [];
                const productsDisplay = productTitles.slice(0, 3).join(', ');
                const moreCount = productTitles.length - 3;
                const dateStr = new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });
                return (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-2 font-medium">#{order._id.slice(-6)}</td>
                    <td className="px-4 py-2">{order.userId?.fullname || '—'}</td>
                    <td className="px-4 py-2 max-w-xs">
                      <div title={productTitles.join(', ')} className="truncate">
                        {productsDisplay || '—'}
                        {moreCount > 0 && ` …(+${moreCount})`}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {typeof order.sellerTotal === 'number'
                        ? order.sellerTotal.toFixed(2)
                        : '0.00'}{' '}
                      €
                    </td>
                    <td className="px-4 py-2">
                      <span className={statusBadge(order.status)}>{order.status}</span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{dateStr}</td>
                    <td className="px-4 py-2">
                      <select
                        aria-label="Select status"
                        className="border rounded px-2 py-1 text-xs bg-white dark:bg-gray-800 dark:border-gray-700"
                        value={order.status}
                        disabled={
                          statusUpdating ||
                          order.status === 'delivered' ||
                          order.status === 'cancelled'
                        }
                        onChange={(e) => handleStatusChange(order, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
