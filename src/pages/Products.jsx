import { lazy, useEffect, useState, useMemo } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProduct';

const ProductsComponenet = lazy(() => import('../components/Products'));

const Products = () => {
  const { categories } = useCategories();

  const [filters, setFilters] = useState({
    title: '',
    categories: [],
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [page, setPage] = useState(1);

  // Debounced filters state
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce filters update
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1); // reset page on filters change
    }, 500);

    return () => clearTimeout(handler);
  }, [filters]);

  // --- Use React Query hook for fetching products ---
  const { data, isLoading, isError } = useProducts(8, page, debouncedFilters);

  // Memoize products and totalPages so child components won't re-render unnecessarily
  const products = useMemo(() => data?.data || [], [data]);
  const totalPages = useMemo(() => data?.meta?.pages || 1, [data]);

  if (isLoading)
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center">Failed to load products</div>
    );

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
            page === i
              ? 'bg-primary text-textMain'
              : 'bg-brand-surface text-textMain hover:bg-primary/50'
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
      <div className="w-full flex flex-col md:flex-row items-center md:items-start">
        {/* Search and filter aside */}
        <aside className="sm:w-full md:w-3/4 lg:w-1/4 ">
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
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                className="w-full bg-surface text-textMain p-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-lg font-semibold text-textMain mb-3">Sort By</h3>
              <div className="space-y-2">
                <label
                  htmlFor="sort-price"
                  className="flex items-center space-x-2 text-textMuted cursor-pointer"
                >
                  <input
                    type="radio"
                    id="sort-price"
                    name="sort"
                    className="accent-primary"
                    checked={filters.sortBy === 'price'}
                    onChange={() => setFilters({ ...filters, sortBy: 'price' })}
                  />
                  <span>Price</span>
                </label>
                <label
                  htmlFor="sort-publish"
                  className="flex items-center space-x-2 text-textMuted cursor-pointer"
                >
                  <input
                    type="radio"
                    id="sort-publish"
                    name="sort"
                    className="accent-primary"
                    checked={filters.sortBy === 'createdAt'}
                    onChange={() => setFilters({ ...filters, sortBy: 'createdAt' })}
                  />
                  <span>Publish At</span>
                </label>
              </div>
            </div>

            {/* Order */}
            <div>
              <h3 className="text-lg font-semibold text-textMain mb-3">Order</h3>
              <div className="space-y-2">
                <label
                  htmlFor="order-desc"
                  className="flex items-center space-x-2 text-textMuted cursor-pointer"
                >
                  <input
                    type="radio"
                    id="order-desc"
                    name="order"
                    className="accent-primary"
                    checked={filters.sortOrder === 'desc'}
                    onChange={() => setFilters({ ...filters, sortOrder: 'desc' })}
                  />
                  <span>Descending</span>
                </label>
                <label
                  htmlFor="order-asc"
                  className="flex items-center space-x-2 text-textMuted cursor-pointer"
                >
                  <input
                    type="radio"
                    id="order-asc"
                    name="order"
                    className="accent-primary"
                    checked={filters.sortOrder === 'asc'}
                    onChange={() => setFilters({ ...filters, sortOrder: 'asc' })}
                  />
                  <span>Ascending</span>
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label htmlFor="min-price" className="block text-lg font-semibold text-textMain mb-3">
                Min Price
              </label>
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
              <label htmlFor="max-price" className="block text-lg font-semibold text-textMain mb-3">
                Max Price
              </label>
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
                          : filters.categories.filter((c) => c !== cat._id);
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
                  title: '',
                  categories: [],
                  minPrice: '',
                  maxPrice: '',
                  sortBy: 'createdAt',
                  sortOrder: 'desc',
                });
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        </aside>

        <div className="flex flex-col items-center w-full">
          {/* Products list */}
          <ProductsComponenet products={products} />
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
        </div>
      </div>
    </>
  );
};

export default Products;
