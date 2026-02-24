'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const mainImage = product.images?.[0] || '/placeholder-product.png';
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, undefined, 1);
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view functionality can be added here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.slug}`}>
        <Card
          className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              {!imageError ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </motion.div>

            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {hasDiscount && (
                <Badge variant="destructive" className="text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.featured && (
                <Badge className="text-xs">Featured</Badge>
              )}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 right-2 flex flex-col gap-2"
            >
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full shadow-md"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant={isWishlisted ? 'default' : 'secondary'}
                size="icon"
                className="h-8 w-8 rounded-full shadow-md"
                onClick={handleWishlist}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </motion.div>

            {/* Add to Cart Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3"
            >
              <Button
                onClick={handleAddToCart}
                className="w-full gap-2"
                size="sm"
                disabled={product.quantity <= 0}
              >
                <ShoppingCart className="h-4 w-4" />
                {product.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </motion.div>
          </div>

          <CardContent className="p-4">
            {/* Category Badge */}
            {product.category && (
              <Badge variant="outline" className="mb-2 text-xs">
                {product.category.name}
              </Badge>
            )}

            {/* Product Name */}
            <h3 className="line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-primary">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.comparePrice!.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.quantity <= 0 ? (
              <p className="mt-1 text-xs text-red-500">Out of stock</p>
            ) : product.quantity < 5 ? (
              <p className="mt-1 text-xs text-orange-500">Only {product.quantity} left</p>
            ) : null}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// Skeleton version for loading state
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-5 w-24 animate-pulse rounded bg-gray-200" />
      </CardContent>
    </Card>
  );
}
