import { useEffect, useState } from "react";
import axios from "../services/axios";
import ProductsComponenet from "../components/Products";
import { useCategories } from "../hooks/useCategories";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { categories } = useCategories();
    console.log(categories);


    const [filters, setFilters] = useState({
        title: "",
        categories: [],
        minPrice: "",
        maxPrice: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Debounced filters state
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    // Debounce filters update
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
            setPage(1); // reset page on filters change
        }, 500); // 500ms delay

        return () => clearTimeout(handler);
    }, [filters]);

    // Fetch products whenever debouncedFilters or page change
    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();
                params.append("page", page);
                params.append("limit", 8);

                if (debouncedFilters.title) params.append("title", debouncedFilters.title);
                if (debouncedFilters.categories.length)
                    params.append("categories", debouncedFilters.categories.join(","));
                if (debouncedFilters.minPrice) params.append("minPrice", debouncedFilters.minPrice);
                if (debouncedFilters.maxPrice) params.append("maxPrice", debouncedFilters.maxPrice);
                if (debouncedFilters.sortBy) params.append("sortBy", debouncedFilters.sortBy);
                if (debouncedFilters.sortOrder) params.append("sortOrder", debouncedFilters.sortOrder);

                const res = await axios.get(`/products/search?${params.toString()}`);
                setProducts(res.data.data || []);
                setTotalPages(res.data.meta.pages || 1);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [debouncedFilters, page]);

    if (loading) return <div>Loading products...</div>;

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${page === i
                        ? "bg-primary text-textMain"
                        : "bg-brand-surface text-textMain hover:bg-primary/50"
                        } transition-colors`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <>
            <div className="w-3/4 flex items-start mt-20 gap-20">
                {/* Search and filter aside */}
                <aside className="w-full lg:w-1/4 xl:w-1/5">
                    <div className="bg-brand-surface p-6 rounded-lg border border-primary space-y-6">
                        {/* Search */}
                        <div>
                            <label htmlFor="search" className="block text-lg font-semibold text-textMain mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                id="search"
                                placeholder="Search products..."
                                value={filters.title}
                                onChange={(e) =>
                                    setFilters({ ...filters, title: e.target.value })
                                }
                                className="w-full bg-surface text-textMain p-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Sort By */}
                        <div>
                            <h3 className="text-lg font-semibold text-textMain mb-3">Sort By</h3>
                            <div className="space-y-2">
                                <label htmlFor="sort-price" className="flex items-center space-x-2 text-textMuted cursor-pointer">
                                    <input
                                        type="radio"
                                        id="sort-price"
                                        name="sort"
                                        className="accent-primary"
                                        checked={filters.sortBy === "price"}
                                        onChange={() => setFilters({ ...filters, sortBy: "price" })}
                                    />
                                    <span>Price</span>
                                </label>
                                <label htmlFor="sort-publish" className="flex items-center space-x-2 text-textMuted cursor-pointer">
                                    <input
                                        type="radio"
                                        id="sort-publish"
                                        name="sort"
                                        className="accent-primary"
                                        checked={filters.sortBy === "createdAt"}
                                        onChange={() => setFilters({ ...filters, sortBy: "createdAt" })}
                                    />
                                    <span>Publish At</span>
                                </label>
                            </div>
                        </div>

                        {/* Order */}
                        <div>
                            <h3 className="text-lg font-semibold text-textMain mb-3">Order</h3>
                            <div className="space-y-2">
                                <label htmlFor="order-desc" className="flex items-center space-x-2 text-textMuted cursor-pointer">
                                    <input
                                        type="radio"
                                        id="order-desc"
                                        name="order"
                                        className="accent-primary"
                                        checked={filters.sortOrder === "desc"}
                                        onChange={() => setFilters({ ...filters, sortOrder: "desc" })}
                                    />
                                    <span>Descending</span>
                                </label>
                                <label htmlFor="order-asc" className="flex items-center space-x-2 text-textMuted cursor-pointer">
                                    <input
                                        type="radio"
                                        id="order-asc"
                                        name="order"
                                        className="accent-primary"
                                        checked={filters.sortOrder === "asc"}
                                        onChange={() => setFilters({ ...filters, sortOrder: "asc" })}
                                    />
                                    <span>Ascending</span>
                                </label>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label htmlFor="min-price" className="block text-lg font-semibold text-textMain mb-3">Min Price</label>
                            <input
                                type="number"
                                id="min-price"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                placeholder="100.00"
                                className="w-full bg-surface text-textMain p-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="max-price" className="block text-lg font-semibold text-textMain mb-3">Max Price</label>
                            <input
                                type="number"
                                id="max-price"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                placeholder="100.00"
                                className="w-full bg-surface text-textMain p-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-lg font-semibold text-textMain mb-3">Categories</h3>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <label
                                        key={cat._id}
                                        htmlFor={`cat-${cat._id}`}
                                        className="flex items-center space-x-2 text-textMuted cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            id={`cat-${cat._id}`}
                                            name="category"
                                            className="accent-primary"
                                            checked={filters.categories.includes(cat._id)}
                                            onChange={(e) => {
                                                const newCats = e.target.checked
                                                    ? [...filters.categories, cat._id] // store only id
                                                    : filters.categories.filter(c => c !== cat._id);
                                                setFilters({ ...filters, categories: newCats });
                                            }}
                                        />
                                        <span>{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Reset Filters */}
                        <button
                            className="text-primary font-semibold hover:underline pt-4"
                            onClick={() => {
                                setFilters({
                                    title: "",
                                    categories: [],
                                    minPrice: "",
                                    maxPrice: "",
                                    sortBy: "createdAt",
                                    sortOrder: "desc",
                                });
                                setPage(1);
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </aside>

                {/* Products list */}
                <ProductsComponenet products={products} />
            </div>

            {/* Pagination */}
            <nav className="flex items-center space-x-3 mt-12">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="text-textMain hover:text-textMuted transition-colors"
                >
                    Previous
                </button>
                {renderPagination()}
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="text-textMain hover:text-textMuted transition-colors"
                >
                    Next
                </button>
            </nav>
        </>
    );
};

export default Products;