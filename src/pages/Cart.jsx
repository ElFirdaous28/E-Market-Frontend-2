import { Image, Trash2, X } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useState } from "react";
import { useCoupons } from "../hooks/useCoupons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useOrders } from "../hooks/useOrders";

export default function Cart() {
    const { validateCoupon } = useCoupons();
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupons, setAppliedCoupons] = useState([]);
    const [couponError, setCouponError] = useState("");

    const { user } = useAuth();
    const navigate = useNavigate();
    const { createOrder } = useOrders();

    const {
        cart,
        isLoading,
        removeItem,
        updateQuantity,
        clearCart,
        summary,
        isSummaryLoading,
    } = useCart({
        couponCodes: appliedCoupons.map(c => c.code),
    });

    const handleApplyCoupon = () => {
        if (!couponCode) return;

        validateCoupon.mutate(
            { code: couponCode, couponCodes: appliedCoupons.map(c => c.code), purchaseAmount: summary?.total || 0 },
            {
                onSuccess: (res) => {
                    setAppliedCoupons(prev => [...prev, res.data.data]);
                    setCouponCode("");
                    setCouponError("");
                },
                onError: (err) => {
                    setCouponError(err?.response?.data?.message || "Invalid coupon");
                },
            }
        );
        console.log(summary);
    };

    const handleRemoveCoupon = (index) => {
        setAppliedCoupons(prev => prev.filter((_, i) => i !== index));
    };

    const handleCheckout = () => {
        if (!user) {
            navigate("/login");
            return;
        }


        createOrder.mutate({ coupons: appliedCoupons.map(c => c.code) }, {
            onSuccess: () => {
                navigate('/orders');
            },
            onError: (err) => {
                console.error(err);
            }
        });
    };

    if (isLoading) return <div>Loading cart...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Side */}
            <div className="lg:col-span-2">
                <div className="bg-surface rounded-lg border border-border">
                    {cart?.items?.length > 0 ? (
                        cart.items.map((item) => (
                            <div key={item._id} className="p-6 border-b border-border">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="bg-gray-200 w-full sm:w-32 h-32 rounded-lg flex items-center justify-center shrink-0">
                                        <Image className="w-16 h-16 text-textMuted" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-textMain mb-1">
                                                    {item.productId.title}
                                                </h3>
                                                <p className="text-sm text-textMuted mb-2">
                                                    {item.productId.description}
                                                </p>
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <span className="text-success-light text-sm font-medium">
                                                        In Stock
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeItem.mutate({ productId: item.productId._id })
                                                }
                                                className="text-error-light hover:text-opacity-80"
                                            >
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center space-x-3 border border-border rounded-lg">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity.mutate({
                                                            productId: item.productId._id,
                                                            quantity: item.quantity - 1,
                                                        })
                                                    }
                                                    className="px-3 py-2 text-textMain hover:text-primary"
                                                >
                                                    -
                                                </button>
                                                <span className="text-textMain font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity.mutate({
                                                            productId: item.productId._id,
                                                            quantity: item.quantity + 1,
                                                        })
                                                    }
                                                    className="px-3 py-2 text-textMain hover:text-primary"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-primary">$89.99</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-textMuted flex items-center justify-center col-span-full min-h-40">
                            Cart is Empty
                        </p>
                    )}
                </div>

                {/* Clear Cart Button */}
                <div className="lg:col-span-2 mt-10">
                    <div className="flex justify-between items-center mb-4">
                        {cart?.items?.length > 0 && (
                            <button
                                onClick={() => clearCart.mutate()}
                                className="px-4 py-2 text-red-500 rounded hover:text-red-600 underline"
                            >
                                Clear Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
                {isSummaryLoading ? (
                    <div>Summary loading....</div>
                ) : (
                    <div className="bg-surface rounded-lg border border-border p-6 sticky">
                        <h2 className="text-xl font-bold text-textMain-light mb-6">
                            Order Summary
                        </h2>

                        {/* Coupon Code */}
                        <div className="mb-6">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="w-2/3 px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary  placeholder-textMuted"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="w-1/3 px-4 py-2 bg-primary text-textMain rounded-lg"
                                >
                                    Apply
                                </button>
                            </div>
                            {couponError && (
                                <p className="text-sm text-red-700 mt-1">{couponError}</p>
                            )}

                            {/* applied coupons */}
                            {appliedCoupons.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    <p className="text-sm text-textMuted">Applied Coupons</p>
                                    <div className="flex flex-wrap gap-2">
                                        {appliedCoupons.map((coupon, index) => (
                                            <div
                                                key={index}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-sm"
                                            >
                                                <span className="font-medium text-primary">{coupon.code}</span>
                                                <span className="text-textMuted">
                                                    -{coupon.value}
                                                    {coupon.type === "percentage" ? "%" : "$"}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveCoupon(index)}
                                                    className="ml-1 hover:bg-red-500/10 rounded p-0.5 transition-colors"
                                                    aria-label="Remove coupon"
                                                >
                                                    <X className="w-3.5 h-3.5 text-red-500" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 my-10 pb-6 border-b border-primary">
                            <div className="flex justify-between text-textMain">
                                <span>Subtotal</span>
                                <span className="font-medium">${summary?.total}</span>
                            </div>
                            <div className="flex justify-between text-primary">
                                <span>Discount</span>
                                <span className="font-medium">-${summary?.discount}</span>
                            </div>
                        </div>

                        {/* Final Amount */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-bold text-textMain">Total</span>
                            <span className="text-2xl font-bold text-primary">
                                ${summary?.finalAmount}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full px-6 py-4 bg-primary text-textMain rounded-lg hover:bg-opacity-90 transition font-semibold mb-3">
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
