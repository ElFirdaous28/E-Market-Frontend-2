import axios from "../services/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useCategories } from "../hooks/useCategories"

export default function CategoriesSlider() {
    const { categories, loading } = useCategories();
    const sliderRef = useRef(null);


    const scrollLeft = () => {
        sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };

    if (loading) return <div>Loading categories...</div>;

    return (
        <section className="w-3/4 mx-auto">
            <h2 className="text-3xl font-bold text-textMain mb-6">Categories</h2>
            <div className="relative overflow-hidden flex items-center gap-6">
                {/* Left button */}
                <button
                    onClick={scrollLeft}
                    className="bg-brand-surface p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition"
                >
                    <ChevronLeft className="h-28 w-28" />
                </button>

                {/* Categories container */}
                <div
                    ref={sliderRef}
                    className="overflow-x-auto flex gap-6 scroll-smooth flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {categories.map((cat) => (
                        <div
                            key={cat._id}
                            className="bg-brand-surface w-56 p-6 rounded-lg hover:shadow-lg transition-shadow border border-primary shrink-0"
                        >
                            <h3 className="text-xl font-semibold text-textMain mb-4">
                                {cat.name}
                            </h3>
                            <p className="text-sm text-textMuted mt-1">
                                {cat.productCount ?? 0} products
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right button */}
                <button
                    onClick={scrollRight}
                    className="bg-brand-surface p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition"
                >
                    <ChevronRight className="h-28 w-28" />
                </button>
            </div>


        </section>
    );
}