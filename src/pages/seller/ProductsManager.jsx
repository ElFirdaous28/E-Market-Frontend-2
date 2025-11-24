import { useSelector } from 'react-redux';
import { useSellerProducts } from '../../hooks/useSellerProducts';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useCategories } from '../../hooks/useCategories';
import { Pencil, Trash2, Image as ImageIcon, Plus, EyeOff, RefreshCcw, UploadCloud } from 'lucide-react';

export default function ProductsManager() {
    const {
        productsQuery,
        deletedProductsQuery,
        createMutation,
        updateMutation,
        deleteMutation,
        publishMutation,
        unpublishMutation,
        restoreMutation,
        selectProduct,
        clearSelection
    } = useSellerProducts();
    const { selectedProduct } = useSelector(state => state.product);
    const { categories, loading: catLoading } = useCategories();

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: '', price: '', stock: '', description: '', categories: [], primaryImage: null, secondaryImages: []
        }
    });

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [showDeleted, setShowDeleted] = useState(false);

    useEffect(() => {
        if (selectedProduct) {
            reset({
                title: selectedProduct.title || '',
                price: selectedProduct.price ?? '',
                stock: selectedProduct.stock ?? '',
                description: selectedProduct.description || '',
                categories: (selectedProduct.categories || []).map(c => c._id || c),
                primaryImage: null,
                secondaryImages: []
            });
        } else {
            reset({ title: '', price: '', stock: '', description: '', categories: [], primaryImage: null, secondaryImages: [] });
        }
        setPage(1);
    }, [selectedProduct, reset]);

    const onFilePrimary = (e) => {
        const file = e.target.files?.[0] || null;
        setValue('primaryImage', file);
    };
    const onFileSecondary = (e) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setValue('secondaryImages', files);
    };
    const onCategoriesChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map(o => o.value);
        setValue('categories', selected, { shouldValidate: true });
    };

    const onSubmit = (data) => {
        const payload = {
            ...data,
            price: Number(data.price),
            stock: Number(data.stock)
        };
        if (selectedProduct) {
            updateMutation.mutate({ id: selectedProduct._id, ...payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const loading = (showDeleted
        ? deletedProductsQuery.isLoading
        : productsQuery.isLoading) || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    const filtered = useMemo(() => {
        const list = showDeleted ? (deletedProductsQuery.data || []) : (productsQuery.data || []);
        const term = search.trim().toLowerCase();
        if (!term) return list;
        return list.filter(p => (p.title || '').toLowerCase().includes(term));
    }, [showDeleted, deletedProductsQuery.data, productsQuery.data, search]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

    // Image previews
    const primaryImageFile = watch('primaryImage');
    const secondaryImageFiles = watch('secondaryImages');
    const [previewPrimary, setPreviewPrimary] = useState(null);
    const [previewSecondary, setPreviewSecondary] = useState([]);

    useEffect(() => {
        if (primaryImageFile) {
            const url = URL.createObjectURL(primaryImageFile);
            setPreviewPrimary(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewPrimary(null);
        }
    }, [primaryImageFile]);

    useEffect(() => {
        if (secondaryImageFiles && secondaryImageFiles.length) {
            const urls = secondaryImageFiles.map(f => URL.createObjectURL(f));
            setPreviewSecondary(urls);
            return () => urls.forEach(u => URL.revokeObjectURL(u));
        } else {
            setPreviewSecondary([]);
        }
    }, [secondaryImageFiles]);

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-textMain">Mes Produits</h2>
                    <p className="text-sm text-textMuted">Gérez votre catalogue: créez, modifiez, publiez, restaurez vos produits.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowDeleted(d => !d)} className="px-3 py-2 text-sm rounded-lg border border-border bg-surface hover:bg-primary/10">
                        {showDeleted ? 'Voir actifs' : 'Voir supprimés'}
                    </button>
                </div>
            </div>
            {productsQuery.isError && !showDeleted && <div className="text-red-600">Erreur: {productsQuery.error?.message}</div>}
            {deletedProductsQuery.isError && showDeleted && <div className="text-red-600">Erreur: {deletedProductsQuery.error?.message}</div>}

            {!showDeleted && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border rounded-xl shadow-sm p-6 max-w-2xl mx-auto grid gap-4">
                    <div>
                        <input {...register('title', { required: 'Titre requis', maxLength: { value: 150, message: 'Max 150 caractères' } })} placeholder="Titre" className="w-full bg-surface text-textMain placeholder:text-textMuted border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                        {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <input type="number" step="0.01" {...register('price', { required: 'Prix requis', min: { value: 0.01, message: 'Min 0.01' } })} placeholder="Prix" className="w-full bg-surface text-textMain placeholder:text-textMuted border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                            {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>}
                        </div>
                        <div>
                            <input type="number" {...register('stock', { required: 'Stock requis', min: { value: 0, message: 'Min 0' } })} placeholder="Stock" className="w-full bg-surface text-textMain placeholder:text-textMuted border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                            {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock.message}</p>}
                        </div>
                    </div>
                    <div>
                        <textarea {...register('description', { maxLength: { value: 1000, message: 'Max 1000 caractères' } })} placeholder="Description" className="w-full bg-surface text-textMain placeholder:text-textMuted border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" rows={4} />
                        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Catégories</label>
                        <select multiple onChange={onCategoriesChange} className="w-full h-36 bg-surface text-textMain border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                            {catLoading && <option>Chargement...</option>}
                            {!catLoading && categories.map(c => (
                                <option key={c._id || c.id} value={c._id || c.id}>{c.name || c.title || 'Catégorie'}</option>
                            ))}
                        </select>
                        {errors.categories && <p className="text-red-600 text-xs mt-1">{errors.categories.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <label className="text-sm font-medium">Image principale</label>
                        <div className="flex items-center gap-3">
                            <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg cursor-pointer bg-surface hover:bg-primary/10">
                                <ImageIcon className="w-4 h-4 text-textMuted" />
                                <span className="text-sm">Choisir une image</span>
                                <input hidden name="primaryImage" type="file" accept="image/*" onChange={onFilePrimary} />
                            </label>
                            {previewPrimary && <img src={previewPrimary} alt="preview" className="h-12 w-12 object-cover rounded border border-border" />}
                        </div>
                        <label className="text-sm font-medium">Images secondaires</label>
                        <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg cursor-pointer bg-surface hover:bg-primary/10">
                            <ImageIcon className="w-4 h-4 text-textMuted" />
                            <span className="text-sm">Ajouter des images</span>
                            <input hidden name="secondaryImages" type="file" accept="image/*" multiple onChange={onFileSecondary} />
                        </label>
                        {previewSecondary.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {previewSecondary.map((url, i) => (
                                    <img key={i} src={url} alt="preview" className="h-12 w-12 object-cover rounded border border-border" />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:brightness-110 disabled:opacity-50">
                            <Plus className="w-4 h-4" />
                            {selectedProduct ? 'Mettre à jour' : 'Créer'}
                        </button>
                        {selectedProduct && (
                            <button type="button" onClick={() => { clearSelection(); }} className="px-4 py-2 bg-surface text-textMain border border-border rounded-lg hover:bg-primary/10">
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="bg-surface border border-border rounded-xl shadow-sm p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Recherche titre..."
                        className="bg-surface text-textMain placeholder:text-textMuted border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full md:w-64"
                    />
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-textMuted">Par page:</label>
                        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="bg-surface text-textMain border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                            {[5, 10, 20].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                {loading && <div className="text-textMuted">Chargement produits...</div>}
                {!loading && filtered.length === 0 && <div className="text-textMuted">Aucun produit.</div>}
                <ul className="divide-y divide-border">
                    {paginated.map(p => (
                        <li key={p._id} className="py-3 flex items-center justify-between">
                            <div className="min-w-0">
                                <div className="font-medium text-textMain truncate flex items-center gap-2">
                                    {p.title}
                                    {p.published && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Publié</span>}
                                    {p.deletedAt && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">Supprimé</span>}
                                </div>
                                <div className="text-sm text-textMuted">Prix: {p.price} • Stock: {p.stock}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                {!showDeleted && (
                                    <>
                                        <button onClick={() => selectProduct(p)} className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10">
                                            <Pencil className="w-4 h-4" />
                                            <span className="text-sm">Éditer</span>
                                        </button>
                                        <button
                                            onClick={() => (p.published ? unpublishMutation.mutate(p._id) : publishMutation.mutate(p._id))}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-textMain border border-border rounded-lg hover:bg-primary/10"
                                        >
                                            {p.published ? <EyeOff className="w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
                                            <span className="text-sm">{p.published ? 'Dépublier' : 'Publier'}</span>
                                        </button>
                                        <button onClick={() => deleteMutation.mutate(p._id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                                            <Trash2 className="w-4 h-4" />
                                            <span className="text-sm">Supprimer</span>
                                        </button>
                                    </>
                                )}
                                {showDeleted && (
                                    <button onClick={() => restoreMutation.mutate(p._id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10">
                                        <RefreshCcw className="w-4 h-4" />
                                        <span className="text-sm">Restaurer</span>
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                {filtered.length > 0 && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-textMuted">Page {currentPage}/{totalPages} • {filtered.length} produits</div>
                        <div className="flex gap-2">
                            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border border-border rounded-lg disabled:opacity-50">Préc.</button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i + 1)}
                                    className={`px-3 py-1 border border-border rounded-lg ${currentPage === i + 1 ? 'bg-primary text-white' : ''}`}
                                >{i + 1}</button>
                            ))}
                            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border border-border rounded-lg disabled:opacity-50">Suiv.</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
