import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef, useCallback, useMemo } from 'react';
import { useCategories } from '../hooks/useCategories';

function CategoriesSlider() {
  const { categories, loading } = useCategories();
  const sliderRef = useRef(null);

  // Memoize scroll functions so they are stable between renders
  const scrollLeft = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, []);

  // Memoize rendered categories so they don't re-render unnecessarily
  const renderedCategories = useMemo(() => {
    return categories.map((cat) => (
      <div
        key={cat._id}
        className="bg-brand-surface min-w-[150px] sm:min-w-[220px] p-4 sm:p-6 rounded-lg hover:shadow-lg border border-primary shrink-0 snap-start flex flex-col items-center text-center"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-textMain mb-2">{cat.name}</h3>
        <p className="text-sm text-textMuted mt-1">{cat.productCount ?? 0} products</p>
      </div>
    ));
  }, [categories]);

  if (loading)
    return <div className="min-h-20 flex items-center justify-center">Loading categories...</div>;

  return (
    <section className="w-full sm:w-11/12 lg:w-3/4 mx-auto py-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-textMain mb-6 text-center sm:text-left">
        Categories
      </h2>

      <div className="relative flex items-center gap-4">
        {/* Left button */}
        <button
          onClick={scrollLeft}
          className="bg-brand-surface p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition hidden sm:flex"
        >
          <ChevronLeft title="swipe left" className="h-6 w-6 sm:h-8 sm:w-8 cursor-pointer" />
        </button>

        {/* Categories container */}
        <div
          ref={sliderRef}
          className="overflow-x-auto flex gap-4 sm:gap-6 scroll-smooth flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory"
        >
          {renderedCategories}
        </div>

        {/* Right button */}
        <button
          onClick={scrollRight}
          className="bg-brand-surface p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition hidden sm:flex"
        >
          <ChevronRight title="swipe right" className="h-6 w-6 sm:h-8 sm:w-8 cursor-pointer" />
        </button>
      </div>
    </section>
  );
}

export default React.memo(CategoriesSlider);
