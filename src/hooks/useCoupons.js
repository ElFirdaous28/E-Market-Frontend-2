import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useAxios } from "../hooks/useAxios";
import { setActiveCoupon } from "../store/couponSlice";
import { toast } from "react-toastify";

export const useCoupons = () => {
    const axios = useAxios();
    const dispatch = useDispatch();

    // --- VALIDATE coupon ---
    const validateCoupon = useMutation({
        mutationFn: ({ code, couponCodes, purchaseAmount }) => axios.post(`/coupons/validate`, { code, couponCodes, purchaseAmount }),
        onSuccess: (res) => {
            dispatch(setActiveCoupon(res.data.data));
            toast.success("Coupon applied!");
        },
        onError: () => {
            dispatch(setActiveCoupon(null));
            toast.error("Invalid coupon code");
        },
    });

    return {
        validateCoupon,
    };
};
