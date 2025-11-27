import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useSellerProducts } from '../../hooks/useSellerProducts';
import { Image as ImageIcon, ArrowLeft, Upload } from 'lucide-react';

export default function CreateProduct() {
  const navigate = useNavigate();
  const { categories, loading: catLoading } = useCategories();
  const { createMutation } = useSellerProducts();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      price: '',
      stock: '',
      description: '',
      categories: [],
      primaryImage: null,
      secondaryImages: [],
    },
  });

  const [previewPrimary, setPreviewPrimary] = useState(null);
  const [previewSecondary, setPreviewSecondary] = useState([]);

  const primaryImageFile = watch('primaryImage');
  const secondaryImageFiles = watch('secondaryImages');

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
      const urls = secondaryImageFiles.map((f) => URL.createObjectURL(f));
      setPreviewSecondary(urls);
      return () => urls.forEach((u) => URL.revokeObjectURL(u));
    } else {
      setPreviewSecondary([]);
    }
  }, [secondaryImageFiles]);

  const onFilePrimary = (e) => {
    const file = e.target.files?.[0] || null;
    setValue('primaryImage', file);
  };

  const onFileSecondary = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setValue('secondaryImages', files);
  };

  const onCategoriesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setValue('categories', selected, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        navigate('/seller/products');
      },
    });
  };

  const loading = createMutation.isPending;

  return (
    <div className="w-full mx-2 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/seller/products')}
          className="p-2 hover:bg-surface border border-border rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-textMain" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-textMain">Créer un nouveau produit</h2>
          <p className="text-sm text-textMuted mt-1">Ajoutez un produit à votre catalogue</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-surface border border-border rounded-xl shadow-sm p-8 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-textMain mb-2">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title', {
              required: 'Titre requis',
              maxLength: { value: 150, message: 'Max 150 caractères' },
            })}
            placeholder="Ex: iPhone 15 Pro Max 256GB"
            className="w-full bg-surface text-textMain placeholder:text-textMuted border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textMain mb-2">
              Prix (DH) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price', {
                required: 'Prix requis',
                min: { value: 0.01, message: 'Min 0.01' },
              })}
              placeholder="0.00"
              className="w-full bg-surface text-textMain placeholder:text-textMuted border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-textMain mb-2">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('stock', {
                required: 'Stock requis',
                min: { value: 0, message: 'Min 0' },
              })}
              placeholder="0"
              className="w-full bg-surface text-textMain placeholder:text-textMuted border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-textMain mb-2">Description</label>
          <textarea
            {...register('description', {
              maxLength: { value: 1000, message: 'Max 1000 caractères' },
            })}
            placeholder="Décrivez votre produit en détail..."
            className="w-full bg-surface text-textMain placeholder:text-textMuted border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            rows={5}
          />
          {errors.description && (
            <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-textMain mb-2">
            Catégories <span className="text-red-500">*</span>
          </label>
          <select
            multiple
            onChange={onCategoriesChange}
            className="w-full h-40 bg-surface text-textMain border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            {catLoading && <option>Chargement...</option>}
            {!catLoading &&
              categories.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id} className="py-1">
                  {c.name || c.title || 'Catégorie'}
                </option>
              ))}
          </select>
          <p className="text-xs text-textMuted mt-1">
            Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs catégories
          </p>
          {errors.categories && (
            <p className="text-red-600 text-xs mt-1">{errors.categories.message}</p>
          )}
        </div>

        {/* Primary Image */}
        <div>
          <label className="block text-sm font-medium text-textMain mb-2">Image principale</label>
          <div className="space-y-3">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-border rounded-lg cursor-pointer bg-surface hover:bg-primary/5 transition-colors">
              <Upload className="w-5 h-5 text-textMuted" />
              <span className="text-sm text-textMain">Choisir une image</span>
              <input
                hidden
                name="primaryImage"
                type="file"
                accept="image/*"
                onChange={onFilePrimary}
              />
            </label>
            {previewPrimary && (
              <div className="relative w-40 h-40 border border-border rounded-lg overflow-hidden">
                <img src={previewPrimary} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Secondary Images */}
        <div>
          <label className="block text-sm font-medium text-textMain mb-2">Images secondaires</label>
          <div className="space-y-3">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-border rounded-lg cursor-pointer bg-surface hover:bg-primary/5 transition-colors">
              <ImageIcon className="w-5 h-5 text-textMuted" />
              <span className="text-sm text-textMain">Ajouter des images</span>
              <input
                hidden
                name="secondaryImages"
                type="file"
                accept="image/*"
                multiple
                onChange={onFileSecondary}
              />
            </label>
            {previewSecondary.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {previewSecondary.map((url, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 border border-border rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`preview ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg shadow-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Création...' : 'Créer le produit'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="px-6 py-2.5 bg-surface text-textMain border border-border rounded-lg hover:bg-primary/10 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
