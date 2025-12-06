import { useSellerCoupons } from '../../hooks/useSellerCoupons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CouponsManager() {
  const {
    couponsQuery,
    coupons,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    deleteMutation,
    pagination,
    page,
    setPage,
  } = useSellerCoupons();
  const navigate = useNavigate();
  const [confirmId, setConfirmId] = useState(null);

  const loading = couponsQuery.isLoading || deleteMutation.isPending;

  const totalPages = pagination?.pages || 1;

  return (
    <div className="w-6xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Vos Coupons</h2>
        <button
          onClick={() => navigate('/seller/coupons/create')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm transition-colors duration-150"
        >
          + Nouveau coupon
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Rechercher code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
        />
        <select
          aria-label="Select status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
        >
          <option value="">Tous statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
        <select
        aria-label="Select type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
        >
          <option value="">Tous types</option>
          <option value="percentage">Pourcentage</option>
          <option value="fixed">Fixe</option>
        </select>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr className="text-left">
                <th className="px-6 py-3.5 font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs">
                  Code
                </th>
                <th className="px-6 py-3.5 font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs">
                  Type
                </th>
                <th className="px-6 py-3.5 font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs">
                  Valeur
                </th>
                <th className="px-6 py-3.5 font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs">
                  Usage max
                </th>
                <th className="px-6 py-3.5 font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs">
                  Statut
                </th>
                <th className="px-6 py-3.5 font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs">
                  Validité
                </th>
                <th className="px-6 py-3.5 font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Chargement...
                  </td>
                </tr>
              )}
              {!loading && coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucun coupon trouvé.
                  </td>
                </tr>
              )}
              {!loading &&
                coupons.map((c) => {
                  const start = new Date(c.startDate).toLocaleDateString('fr-FR');
                  const end = new Date(c.expirationDate).toLocaleDateString('fr-FR');
                  return (
                    <tr
                      key={c._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                        {c.code}
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-700 dark:text-gray-300">
                        {c.type}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                        {c.value}
                        {c.type === 'percentage' ? '%' : '€'}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {c.maxUsage ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            c.status === 'active'
                              ? 'px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium'
                              : 'px-2.5 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium'
                          }
                        >
                          {c.status}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 text-xs"
                        title={`${start} → ${end}`}
                      >
                        {start} → {end}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <Link
                            to={`/seller/coupons/edit/${c._id}`}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
                          >
                            Éditer
                          </Link>
                          <button
                            onClick={() => setConfirmId(c._id)}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors disabled:opacity-50"
                            disabled={deleteMutation.isPending}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-3 justify-end items-center flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Précédent
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Suivant
          </button>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-5 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Confirmer suppression
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer ce coupon ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmId(null)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                disabled={deleteMutation.isPending}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(confirmId, { onSettled: () => setConfirmId(null) });
                }}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
