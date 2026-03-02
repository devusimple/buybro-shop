'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import type { Product, SortOption } from '@/types';
import db from '@/lib/db';

interface ProductGridProps {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: SortOption;
  featured?: boolean;
  page?: number;
  limit?: number;
  onPaginationChange?: (pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }) => void;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function ProductGrid({
  category,
  minPrice,
  maxPrice,
  search,
  sort = 'newest',
  featured,
  page = 1,
  limit = 12,
  onPaginationChange,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    // 





    const res = db.query({
      products: {
        $: {
          limit,
          offset: page,
        },
        category: { $: {} },
        variants: { $: {} }
      }
    });




    // 
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice.toString());
      if (maxPrice) params.append('maxPrice', maxPrice.toString());
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      if (featured) params.append('featured', 'true');
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await fetch(`/api/products?${params.toString()}`);
      const result: ProductsResponse = await response.json();
      console.log("products", { result });
      if (result.success) {
        setProducts(result.data);
        onPaginationChange?.({
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        });
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [category, minPrice, maxPrice, search, sort, featured, page, limit, onPaginationChange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: limit }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center"
      >
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-lg border border-gray-100 p-12 text-center"
      >
        <PackageOpen className="mb-4 h-16 w-16 text-gray-400" />
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="mt-2 text-gray-500">
          Try adjusting your filters or search to find what you're looking for.
        </p>
      </motion.div>
    );
  }

  // Products grid
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${category}-${minPrice}-${maxPrice}-${search}-${sort}-${featured}-${page}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

// Skeleton grid for initial loading
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
