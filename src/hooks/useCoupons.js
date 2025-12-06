import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useAxios } from '../hooks/useAxios';
import { setActiveCoupon } from '../store/couponSlice';
import { toast } from 'react-toastify';

export const useCoupons = () => {
  const axios = useAxios();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const validateCoupon = useMutation({
    mutationFn: ({ code, couponCodes, purchaseAmount }) =>
      axios.post(`/coupons/validate`, { code, couponCodes, purchaseAmount }),
    onMutate: async ({ code }) => {
      dispatch(setActiveCoupon({ code }));
    },
    onSuccess: (res) => {
      dispatch(setActiveCoupon(res.data.data));
      toast.success('Coupon applied!');
      // Cache the validated coupon
      queryClient.setQueryData(['coupon', res.data.data.code], res.data.data);
    },
    onError: (  ) => {
      // Revert optimistic update
      dispatch(setActiveCoupon(null));
      toast.error('Coupon invalid or expired');
    },
  });

  return { validateCoupon };
};
