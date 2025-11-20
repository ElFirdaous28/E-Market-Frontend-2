import { useSelector } from 'react-redux';
import { useSellerProducts } from '../../hooks/useSellerProducts';
import { useState, useEffect } from 'react';

export default function ProductsManager() {
    const { productsQuery, createMutation, updateMutation, deleteMutation, selectProduct, clearSelection } = useSellerProducts();
    const { selectedProduct } = useSelector(state => state.product);
    const [form, setForm] = useState({ title: '', price: '', stock: '', description: '', categories: '', primaryImage: null, secondaryImages: [] });

    useEffect(() => {
        if (selectedProduct) {
            setForm({
                title: selectedProduct.title || '',
                price: selectedProduct.price ?? '',
                stock: selectedProduct.stock ?? '',
                description: selectedProduct.description || '',
                categories: (selectedProduct.categories || []).map(c => c._id || c).join(', '),
                primaryImage: null,
                secondaryImages: []
            });
        } else {
            setForm({ title: '', price: '', stock: '', description: '', categories: '', primaryImage: null, secondaryImages: [] });
        }
    }, [selectedProduct]);

    const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const onFile = e => setForm(f => ({ ...f, [e.target.name]: e.target.files?.length > 1 ? Array.from(e.target.files) : e.target.files?.[0] }));

    const onSubmit = e => {
        e.preventDefault();
        const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
        if (selectedProduct) {
            updateMutation.mutate({ id: selectedProduct._id, ...payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const loading = productsQuery.isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Produits</h2>
            {productsQuery.isError && <div className="text-red-600">Erreur: {productsQuery.error?.message}</div>}
            <form onSubmit={onSubmit} className="grid gap-2 max-w-md">
                <input name="title" value={form.title} onChange={onChange} placeholder="Titre" className="border px-3 py-2 rounded" required />
                <input name="price" value={form.price} onChange={onChange} placeholder="Prix" type="number" className="border px-3 py-2 rounded" required />
                <input name="stock" value={form.stock} onChange={onChange} placeholder="Stock" type="number" className="border px-3 py-2 rounded" required />
                <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="border px-3 py-2 rounded" />
                <input name="categories" value={form.categories} onChange={onChange} placeholder="Catégories (IDs, séparés par des virgules)" className="border px-3 py-2 rounded" />
                <div className="grid grid-cols-1 gap-2">
                    <input name="primaryImage" type="file" accept="image/*" onChange={onFile} className="border px-3 py-2 rounded" />
                    <input name="secondaryImages" type="file" accept="image/*" multiple onChange={onFile} className="border px-3 py-2 rounded" />
                </div>
                <div className="flex gap-2">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
                        {selectedProduct ? 'Mettre à jour' : 'Créer'}
                    </button>
                    {selectedProduct && (
                        <button type="button" onClick={clearSelection} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
                    )}
                </div>
            </form>
            <div className="border rounded p-4">
                {productsQuery.isLoading && <div>Chargement produits...</div>}
                {!productsQuery.isLoading && productsQuery.data?.length === 0 && <div>Aucun produit.</div>}
                <ul className="space-y-2">
                    {productsQuery.data?.map(p => (
                        <li key={p._id} className="flex items-center justify-between border-b pb-2">
                            <div>
                                <div className="font-medium">{p.title}</div>
                                <div className="text-sm text-gray-600">Prix: {p.price} | Stock: {p.stock}</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => selectProduct(p)} className="text-blue-600 text-sm">Éditer</button>
                                <button onClick={() => deleteMutation.mutate(p._id)} className="text-red-600 text-sm">Supprimer</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
