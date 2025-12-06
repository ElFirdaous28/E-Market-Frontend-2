import { useSellerProducts } from '../../hooks/useSellerProducts';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, EyeOff, RefreshCcw, UploadCloud, Package } from 'lucide-react';

export default function ProductsManager() {
  const navigate = useNavigate();
  const {
    productsQuery,
    deletedProductsQuery,
    deleteMutation,
    publishMutation,
    unpublishMutation,
    restoreMutation,
  } = useSellerProducts();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDeleted, setShowDeleted] = useState(false);

  const loading =
    (showDeleted ? deletedProductsQuery.isLoading : productsQuery.isLoading) ||
    deleteMutation.isPending;

  const filtered = useMemo(() => {
    const list = showDeleted ? deletedProductsQuery.data || [] : productsQuery.data || [];
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((p) => (p.title || '').toLowerCase().includes(term));
  }, [showDeleted, deletedProductsQuery.data, productsQuery.data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-textMain">Mes Produits</h2>
          <p className="text-sm text-textMuted mt-1">Gérez votre catalogue de produits</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleted((d) => !d)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-border bg-surface hover:bg-primary/10 transition-colors"
          >
            <Package className="w-4 h-4" />
            {showDeleted ? 'Produits actifs' : 'Produits supprimés'}
          </button>
          {!showDeleted && (
            <button
              onClick={() => navigate('/seller/products/create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white [text-shadow:0_0_2px_rgba(0,0,0,0.8)] rounded-lg shadow-sm hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" />
              Créer un produit
            </button>
          )}
        </div>
      </div>

      {productsQuery.isError && !showDeleted && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Erreur: {productsQuery.error?.message}
        </div>
      )}
      {deletedProductsQuery.isError && showDeleted && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Erreur: {deletedProductsQuery.error?.message}
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-surface">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher par titre..."
              className="bg-surface text-textMain placeholder:text-textMuted border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full md:w-80"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-textMuted whitespace-nowrap">Afficher:</label>
              <select
                aria-label="Page Size"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-surface text-textMain border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                {[5, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="p-8 text-center text-textMuted">
            <div className="animate-pulse">Chargement des produits...</div>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 mx-auto text-textMuted/30 mb-3" />
            <p className="text-textMuted">
              {search
                ? 'Aucun produit trouvé.'
                : showDeleted
                  ? 'Aucun produit supprimé.'
                  : 'Aucun produit. Créez votre premier produit.'}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-textMuted uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-textMuted uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-textMuted uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-textMuted uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-textMuted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((p) => (
                  <tr key={p._id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-surface border border-border rounded-lg overflow-hidden shrink-0">
                          {p.primaryImage ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL}` + p.primaryImage}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-textMuted/30">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-textMain truncate">{p.title}</div>
                          {p.description && (
                            <div className="text-sm text-textMuted truncate max-w-md">
                              {p.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-textMain font-medium">{p.price} DH</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : p.stock > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {p.stock} unités
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {p.published && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 w-fit">
                            Publié
                          </span>
                        )}
                        {p.deletedAt && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-500 border border-red-200 w-fit">
                            Supprimé
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {!showDeleted && (
                          <>
                            <button
                              onClick={() => navigate(`/seller/products/edit/${p._id}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-500 border border-blue-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                              title="Éditer"
                            >
                              <Pencil className="w-4 h-4" />
                              <span className="text-sm">Éditer</span>
                            </button>
                            <button
                              onClick={() =>
                                p.published
                                  ? unpublishMutation.mutate(p._id)
                                  : publishMutation.mutate(p._id)
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-textMain border border-border rounded-lg hover:bg-primary/10 transition-colors"
                              title={p.published ? 'Dépublier' : 'Publier'}
                            >
                              {p.published ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <UploadCloud className="w-4 h-4" />
                              )}
                              <span className="text-sm">
                                {p.published ? 'Dépublier' : 'Publier'}
                              </span>
                            </button>
                            <button
                              onClick={() => deleteMutation.mutate(p._id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-sm">Supprimer</span>
                            </button>
                          </>
                        )}
                        {showDeleted && (
                          <button
                            onClick={() => restoreMutation.mutate(p._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
                            title="Restaurer"
                          >
                            <RefreshCcw className="w-4 h-4" />
                            <span className="text-sm">Restaurer</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-border bg-surface/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-textMuted">
                Affichage de {(currentPage - 1) * pageSize + 1} à{' '}
                {Math.min(currentPage * pageSize, filtered.length)} sur {filtered.length} produits
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                >
                  Précédent
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${currentPage === pageNum
                            ? 'bg-primary text-white border-primary'
                            : 'border-border hover:bg-primary/10'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
