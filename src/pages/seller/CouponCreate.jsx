import { useSellerCoupons } from '../../hooks/useSellerCoupons';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function CouponCreate() {
    const { createMutation } = useSellerCoupons();
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            code: '',
            type: 'percentage',
            value: 10,
            minimumPurchase: 0,
            startDate: new Date().toISOString().slice(0, 16),
            expirationDate: '',
            maxUsage: '',
            maxUsagePerUser: 1,
            status: 'active'
        }
    });

    const onSubmit = (data) => {
        const payload = {
            ...data,
            startDate: new Date(data.startDate),
            expirationDate: new Date(data.expirationDate),
            maxUsage: data.maxUsage === '' ? null : Number(data.maxUsage),
            value: Number(data.value),
            minimumPurchase: Number(data.minimumPurchase),
            maxUsagePerUser: Number(data.maxUsagePerUser)
        };
        createMutation.mutate(payload, {
            onSuccess: () => {
                reset();
                navigate('/seller/coupons');
            }
        });
    };


    return (
        <div className="w-5xl mx-auto space-y-6 p-4 sm:p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Créer un coupon</h2>
                <button onClick={() => navigate(-1)} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors">Retour</button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Code</label>
                        <input {...register('code', { required: true })} className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" placeholder="CODEPROMO" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Type</label>
                        <select {...register('type')} className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all">
                            <option value="percentage">Pourcentage</option>
                            <option value="fixed">Fixe</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Valeur</label>
                        <input type="number" step="0.01" {...register('value', { required: true })} className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Achat minimum</label>
                        <input type="number" step="0.01" {...register('minimumPurchase')} className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Début</label>
                        <input type="datetime-local" {...register('startDate', { required: true })} className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Expiration</label>
                        <input type="datetime-local" {...register('expirationDate', { required: true })} className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Utilisation max (global)</label>
                        <input type="number" {...register('maxUsage')} className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" placeholder="Illimité si vide" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Max par utilisateur</label>
                        <input type="number" {...register('maxUsagePerUser', { required: true })} className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Statut</label>
                        <select {...register('status')} className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all">
                            <option value="active">Actif</option>
                            <option value="inactive">Inactif</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-2">
                        <button type="submit" disabled={createMutation.isPending} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            {createMutation.isPending ? 'Création...' : 'Créer le coupon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
