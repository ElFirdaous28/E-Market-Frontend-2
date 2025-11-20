import ProductsManager from './ProductsManager';

export default function SellerDashboard() {
    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Tableau de Bord Vendeur</h1>
            <ProductsManager />
        </div>
    );
}
