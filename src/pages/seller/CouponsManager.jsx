import { useSellerCoupons } from '../../hooks/useSellerCoupons';
import { useState, useEffect } from 'react';

export default function CouponsManager() {
    const { couponsQuery, createMutation, updateMutation, deleteMutation } = useSellerCoupons();
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ code: '', discount: '' });

    useEffect(() => {
        if (editing) {
            setForm({ code: editing.code || '', discount: editing.discount || '' });
        } else {
            setForm({ code: '', discount: '' });
        }
    }, [editing]);

    const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const onSubmit = e => {
        e.preventDefault();
        const payload = { ...form, discount: Number(form.discount) };
        if (editing) {
            updateMutation.mutate({ id: editing.id, ...payload });
            setEditing(null);
        } else {
            createMutation.mutate(payload);
        }
    };

    const loading = couponsQuery.isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Coupons</h2>
            {couponsQuery.isError && <div className="text-red-600">Erreur: {couponsQuery.error?.message}</div>}
            <form onSubmit={onSubmit} className="grid gap-2 max-w-md">
                <input name="code" value={form.code} onChange={onChange} placeholder="Code" className="border px-3 py-2 rounded" required />
                <input name="discount" value={form.discount} onChange={onChange} placeholder="Réduction (%)" type="number" className="border px-3 py-2 rounded" required />
                <div className="flex gap-2">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
                        {editing ? 'Mettre à jour' : 'Créer'}
                    </button>
                    {editing && (
                        <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
                    )}
                </div>
            </form>
            <div className="border rounded p-4">
                {couponsQuery.isLoading && <div>Chargement coupons...</div>}
                {!couponsQuery.isLoading && couponsQuery.data?.length === 0 && <div>Aucun coupon.</div>}
                <ul className="space-y-2">
                    {couponsQuery.data?.map(c => (
                        <li key={c.id} className="flex items-center justify-between border-b pb-2">
                            <div>
                                <div className="font-medium">{c.code}</div>
                                <div className="text-sm text-gray-600">Réduction: {c.discount}%</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditing(c)} className="text-blue-600 text-sm">Éditer</button>
                                <button onClick={() => deleteMutation.mutate(c.id)} className="text-red-600 text-sm">Supprimer</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
