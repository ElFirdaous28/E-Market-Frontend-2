import { useSellerCoupons } from '../../hooks/useSellerCoupons';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function CouponEdit() {
  const { updateMutation, getById } = useSellerCoupons();
  const navigate = useNavigate();
  const { id } = useParams();
  const coupon = getById(id);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      code: '',
      type: 'percentage',
      value: 0,
      minimumPurchase: 0,
      startDate: '',
      expirationDate: '',
      maxUsage: '',
      maxUsagePerUser: 1,
      status: 'active',
    },
  });

  useEffect(() => {
    if (coupon) {
      reset({
        code: coupon.code || '',
        type: coupon.type || 'percentage',
        value: coupon.value ?? 0,
        minimumPurchase: coupon.minimumPurchase ?? 0,
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().slice(0, 16) : '',
        expirationDate: coupon.expirationDate
          ? new Date(coupon.expirationDate).toISOString().slice(0, 16)
          : '',
        maxUsage: coupon.maxUsage ?? '',
        maxUsagePerUser: coupon.maxUsagePerUser ?? 1,
        status: coupon.status || 'active',
      });
    }
  }, [coupon, reset]);

  const onSubmit = (data) => {
    // Defensive parsing of dates and numbers
    const start = data.startDate ? new Date(data.startDate) : null;
    const end = data.expirationDate ? new Date(data.expirationDate) : null;
    const payload = {
      code: data.code.trim().toUpperCase(),
      type: data.type,
      value: Number(data.value),
      minimumPurchase: Number(data.minimumPurchase) || 0,
      startDate: start,
      expirationDate: end,
      maxUsage: data.maxUsage === '' ? null : Number(data.maxUsage),
      maxUsagePerUser: Number(data.maxUsagePerUser) || 1,
      status: data.status,
    };
    updateMutation.mutate(
      { id, ...payload },
      {
        onSuccess: () => navigate('/seller/coupons'),
      }
    );
  };

  if (!coupon) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-gray-600 dark:text-gray-400">
        Chargement coupon...
      </div>
    );
  }

  return (
    <div className="w-6xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Modifier coupon</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
        >
          Retour
        </button>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Code
            </label>
            <input
              {...register('code', { required: true })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Type
            </label>
            <select
              {...register('type')}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            >
              <option value="percentage">Pourcentage</option>
              <option value="fixed">Fixe</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Valeur
            </label>
            <input
              type="number"
              step="0.01"
              {...register('value', { required: true })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Achat minimum
            </label>
            <input
              type="number"
              step="0.01"
              {...register('minimumPurchase')}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Début
            </label>
            <input
              type="datetime-local"
              {...register('startDate', { required: true })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Expiration
            </label>
            <input
              type="datetime-local"
              {...register('expirationDate', { required: true })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Utilisation max (global)
            </label>
            <input
              type="number"
              {...register('maxUsage')}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              placeholder="Illimité si vide"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Max par utilisateur
            </label>
            <input
              type="number"
              {...register('maxUsagePerUser', { required: true })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              Statut
            </label>
            <select
              {...register('status')}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updateMutation.isPending ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
