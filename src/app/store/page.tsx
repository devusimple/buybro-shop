'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProductGrid } from '@/components/store/ProductGrid';
import { ProductFilters } from '@/components/store/ProductFilters';
import { ProductSort } from '@/components/store/ProductSort';
import { SearchBar } from '@/components/store/SearchBar';
import { Pagination } from '@/components/store/Pagination';
import type { SortOption } from '@/types';
import db from '@/lib/db';

export default function StorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState<string | undefined>(searchParams.get('category') || undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [search, setSearch] = useState<string | undefined>(searchParams.get('search') || undefined);
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest');
  const [featured, setFeatured] = useState<boolean>(searchParams.get('featured') === 'true');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });



  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (sort !== 'newest') params.set('sort', sort);
    if (featured) params.set('featured', 'true');
    if (page > 1) params.set('page', page.toString());


    const newUrl = params.toString() ? `/store?${params.toString()}` : '/store';
    router.replace(newUrl, { scroll: false });
  }, [category, search, sort, featured, page, router]);

  const handleCategoryChange = (newCategory: string | undefined) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
  };

  const handleSearchChange = (newSearch: string | undefined) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  };

  const handleClearFilters = () => {
    setCategory(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSearch(undefined);
    setFeatured(false);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <div className="border-b bg-muted/30">
        <div className="container px-4 md:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {featured ? 'Featured Products' : 'All Products'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {category
                ? `Browse our ${category.replace(/-/g, ' ')} collection`
                : 'Discover our curated selection of premium products'}
            </p>
          </motion.div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <ProductFilters
            selectedCategory={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            onClearFilters={handleClearFilters}
          />

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <SearchBar
                  value={search}
                  onSearch={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full sm:w-64"
                />
                <ProductSort value={sort} onSortChange={handleSortChange} />
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid
              category={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              search={search}
              sort={sort}
              featured={featured}
              page={page}
              limit={12}
              onPaginationChange={setPagination}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Showing {((pagination.page - 1) * 12) + 1} - {Math.min(pagination.page * 12, pagination.total)} of {pagination.total} products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
