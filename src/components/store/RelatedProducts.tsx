'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import type { Product } from '@/types';

interface RelatedProductsProps {
  categoryId?: string;
  currentProductId: string;
  limit?: number;
}

export function RelatedProducts({
  categoryId,
  currentProductId,
  limit = 4,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (categoryId) {
          // We need to fetch by category ID, but API uses slug
          // For now, we'll fetch featured products and filter
          params.append('limit', (limit + 5).toString()); // Fetch extra to filter out current product
        } else {
          params.append('featured', 'true');
          params.append('limit', (limit + 5).toString());
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          // Filter out the current product and limit
          const filtered = result.data
            .filter((p: Product) => p.id !== currentProductId)
            .slice(0, limit);
          setProducts(filtered);
        } else {
          setError('Failed to load related products');
        }
      } catch (err) {
        setError('An error occurred');
        console.error('Error fetching related products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId, limit]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: limit }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Error or empty state
  if (error || products.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">You May Also Like</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </motion.section>
  );
}

// Empty state component for when there are no related products
export function RelatedProductsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
      <PackageOpen className="mb-4 h-12 w-12 text-gray-400" />
      <p className="text-gray-500">No related products found</p>
    </div>
  );
}
