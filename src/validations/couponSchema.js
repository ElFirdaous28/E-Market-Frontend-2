import * as yup from 'yup';

export const couponSchema = yup.object({
    code: yup
        .string()
        .required('Le code du coupon est requis')
        .min(3, 'Le code doit contenir au moins 3 caractères')
        .max(20, 'Le code ne peut pas dépasser 20 caractères')
        .matches(
            /^[A-Z0-9_-]+$/,
            'Le code doit contenir uniquement des lettres majuscules, chiffres, tirets et underscores'
        ),

    type: yup
        .string()
        .required('Le type de réduction est requis')
        .oneOf(['percentage', 'fixed'], 'Le type doit être pourcentage ou fixe'),

    value: yup
        .number()
        .typeError('La valeur doit être un nombre')
        .required('La valeur de réduction est requise')
        .positive('La valeur doit être positive')
        .test(
            'percentage-limit',
            'Le pourcentage ne peut pas dépasser 100%',
            function (value) {
                return this.parent.type !== 'percentage' || value <= 100;
            }
        ),

    minimumPurchase: yup
        .number()
        .typeError('L\'achat minimum doit être un nombre')
        .min(0, 'L\'achat minimum ne peut pas être négatif')
        .default(0),

    startDate: yup
        .string()
        .required('La date de début est requise')
        .test('valid-date', 'Date de début invalide', (value) => {
            return value && !isNaN(new Date(value).getTime());
        }),

    expirationDate: yup
        .string()
        .required('La date d\'expiration est requise')
        .test('valid-date', 'Date d\'expiration invalide', (value) => {
            return value && !isNaN(new Date(value).getTime());
        })
        .test(
            'after-start',
            'La date d\'expiration doit être après la date de début',
            function (value) {
                const startDate = this.parent.startDate;
                if (!startDate || !value) return true;
                return new Date(value) > new Date(startDate);
            }
        ),

    maxUsage: yup
        .number()
        .nullable()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .min(1, 'L\'utilisation maximale doit être au moins 1'),

    maxUsagePerUser: yup
        .number()
        .typeError('L\'utilisation max par utilisateur doit être un nombre')
        .required('L\'utilisation max par utilisateur est requise')
        .positive('L\'utilisation max par utilisateur doit être positive')
        .integer('L\'utilisation max par utilisateur doit être un entier')
        .min(1, 'L\'utilisation max par utilisateur doit être au moins 1'),

    status: yup
        .string()
        .oneOf(['active', 'inactive'], 'Le statut doit être actif ou inactif')
        .default('active'),
});
