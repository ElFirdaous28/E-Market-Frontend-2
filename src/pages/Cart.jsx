import { Image, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart"

export default function Cart() {
    const { cart, isLoading, removeItem, updateQuantity, clearCart } = useCart();

    if (isLoading) return <div>Loading cart...</div>;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2">

                {/* Cart Items */}
                <div className="bg-surface rounded-lg border border-border">
                    {cart?.items?.length > 0 ? (
                        cart.items.map((item) => (
                            <div key={item._id} className="p-6 border-b border-border">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Product Image */}
                                    <div
                                        className="bg-gray-200 w-full sm:w-32 h-32 rounded-lg flex items-center justify-center shrink-0">
                                        <Image className="w-16 h-16 text-textMuted" />
                                    </div>

                                    {/* Product Details  */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3
                                                    className="text-lg font-semibold text-textMain  mb-1">
                                                    Wireless Headphones
                                                </h3>
                                                <p className="text-sm text-textMuted mb-2">
                                                    Color: Black | Premium Edition
                                                </p>
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <span
                                                        className="text-success-light text-sm font-medium">In
                                                        Stock</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem.mutate({ productId: item.productId._id })}
                                                className="text-error-light hover:text-opacity-80">
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            {/* Quantity Selector */}
                                            <div
                                                className="flex items-center space-x-3 border border-border rounded-lg">
                                                <button onClick={() => updateQuantity.mutate({ productId: item.productId._id, quantity: item.quantity - 1 })}
                                                    className="px-3 py-2 text-textMain  hover:text-primary">
                                                    -
                                                </button>
                                                <span id="qty-1"
                                                    className="text-textMain font-medium">{item.quantity}</span>
                                                <button onClick={() => updateQuantity.mutate({ productId: item.productId._id, quantity: item.quantity + 1 })}
                                                    className="px-3 py-2 text-textMain hover:text-primary">
                                                    +
                                                </button>
                                            </div>

                                            {/* Price  */}
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

                {/* clear cart button */}
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
        </div>
    )
}
