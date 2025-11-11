import { Image } from "lucide-react";
import { Link } from "react-router-dom";

export default function Products({ products }) {

    return (
        <section className="w-11/12 md:w-3/4 mx-auto">
            <h2 className="text-3xl font-bold text-textMain mb-6">Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {products.length > 0 ? (
                    products.slice(0, 8).map((product) => (
                        <Link
                            key={product._id}
                            to={`/products/${product._id}`}
                            className="bg-surface rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-primary flex flex-col"
                        >
                            {/* Product Image */}
                            <div className="bg-border aspect-square flex items-center justify-center">
                                {product.primaryImage ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${product.primaryImage}`}
                                        alt={product.title}
                                        className="object-cover w-4/5 h-4/5"
                                    />
                                ) : (
                                    <Image className="w-16 h-16 text-gray-500" />
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4 flex flex-col flex-1">
                                <div>
                                    <h3 className="text-lg font-semibold text-textMain capitalize">{product.title}</h3>
                                    <p className="text-sm text-textMuted mt-1">
                                        {product.description
                                            ? product.description.length > 100
                                                ? product.description.slice(0, 50) + "..."
                                                : product.description
                                            : "No description available"}
                                    </p>
                                </div>

                                {/* Price + Add to Cart at the bottom */}
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xl font-bold text-primary mt-2">
                                        ${product.price?.toFixed(2) ?? "N/A"}
                                    </span>
                                    <button className="mt-2 border border-primary hover:bg-primary text-textMain text-sm px-4 py-2 rounded-full font-semibold transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-textMuted col-span-full text-center">
                        No products available
                    </p>
                )}
            </div>

        </section>
    );
}
