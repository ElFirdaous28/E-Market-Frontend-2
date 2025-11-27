import { useMemo } from 'react';
import { useSellerProducts } from '../../hooks/useSellerProducts';
import { useSellerOrders } from '../../hooks/useSellerOrders';
import { DollarSign, Package, Clock, CheckCircle2, Receipt } from 'lucide-react';

export default function SellerOverview() {
  const { productsQuery } = useSellerProducts();
  const { ordersQuery } = useSellerOrders();

  const products = useMemo(() => productsQuery.data || [], [productsQuery.data]);
  const orders = useMemo(() => ordersQuery.data || [], [ordersQuery.data]);

  const stats = useMemo(() => {
    const delivered = orders.filter((o) => (o.status || '').toLowerCase() === 'delivered');
    const pending = orders.filter((o) => (o.status || '').toLowerCase() === 'pending');
    // Prefer sellerTotal (computed server side) else fallback to total or totalPrice
    const revenue = delivered.reduce((sum, o) => {
      const v =
        o.sellerTotal != null ? o.sellerTotal : Number(o.total) || Number(o.totalPrice) || 0;
      return sum + v;
    }, 0);
    return {
      totalProducts: products.length,
      pendingOrders: pending.length,
      deliveredOrders: delivered.length,
      totalRevenue: revenue,
    };
  }, [products, orders]);

  const recentOrders = useMemo(() => {
    const sorted = [...orders].sort((a, b) => {
      const ad = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const bd = new Date(b.createdAt || b.updatedAt || 0).getTime();
      return bd - ad;
    });
    return sorted.slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6 max-w-6xl w-full mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-textMain">Vue d&aposensemble</h2>
          <p className="text-sm text-textMuted mt-1">Aperçu rapide de vos performances</p>
        </div>
      </div>

      {/* Loading / Error banners */}
      {(productsQuery.isLoading || ordersQuery.isLoading) && (
        <div className="bg-surface border border-border rounded-lg p-4 text-textMuted">
          Chargement des statistiques...
        </div>
      )}
      {ordersQuery.isError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg">
          Impossible de charger les commandes vendeur (endpoint manquant). Les statistiques
          d&aposorders peuvent être incomplètes.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Revenu total"
          value={`${stats.totalRevenue.toFixed(2)} DH`}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          icon={Clock}
          label="Commandes en attente"
          value={stats.pendingOrders}
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatCard
          icon={CheckCircle2}
          label="Commandes livrées"
          value={stats.deliveredOrders}
          color="text-indigo-600"
          bg="bg-indigo-50"
        />
        <StatCard
          icon={Package}
          label="Total produits"
          value={stats.totalProducts}
          color="text-primary"
          bg="bg-primary/10"
        />
      </div>

      {/* Recent orders */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-medium text-textMain">Commandes récentes</h3>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-textMuted">
            <div className="flex items-center justify-center mb-2">
              <Receipt className="w-6 h-6 text-textMuted/40" />
            </div>
            Aucune commande récente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-textMuted uppercase tracking-wider">
                    #
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-textMuted uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-textMuted uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-textMuted uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((o) => (
                  <tr key={o._id || o.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-3 font-medium text-textMain">{o._id || o.id}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-3">{o.finalAmount} DH</td>
                    <td className="px-6 py-3 text-textMuted">
                      {new Date(o.createdAt || o.updatedAt || Date.now()).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
 
function StatCard({ icon: Icon, label, value, color = 'text-textMain', bg = 'bg-surface/50' }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <div className="text-sm text-textMuted">{label}</div>
        <div className="text-xl font-semibold text-textMain">{value}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status = '' }) {
  const s = String(status).toLowerCase();
  let classes = 'bg-gray-100 text-gray-700 border-gray-200';
  if (s === 'pending') classes = 'bg-amber-100 text-amber-800 border-amber-200';
  if (s === 'delivered') classes = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (s === 'cancelled' || s === 'canceled') classes = 'bg-red-100 text-red-700 border-red-200';
  if (s === 'processing') classes = 'bg-indigo-100 text-indigo-800 border-indigo-200';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}
    >
      {status || '—'}
    </span>
  );
}
