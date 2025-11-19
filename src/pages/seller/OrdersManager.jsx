import { useSellerOrders } from '../../hooks/useSellerOrders';

export default function OrdersManager() {
    const { ordersQuery } = useSellerOrders();

    if (ordersQuery.isLoading) return <div>Chargement commandes...</div>;
    if (ordersQuery.isError) return <div className="text-red-600">Erreur: {ordersQuery.error?.message}</div>;

    const orders = ordersQuery.data || [];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Commandes contenant vos produits</h2>
            {orders.length === 0 && <div>Aucune commande liée à vos produits.</div>}
            <ul className="space-y-2">
                {orders.map(o => (
                    <li key={o.id} className="border rounded p-3">
                        <div className="flex justify-between">
                            <span className="font-medium">Commande #{o.id}</span>
                            <span className="text-sm text-gray-600">Statut: {o.status}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                            Produits: {o.items?.map(i => i.productName).join(', ') || '—'}
                        </div>
                        <div className="text-sm text-gray-500">Total: {o.total} €</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
