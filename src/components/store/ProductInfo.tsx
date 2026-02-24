'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCartStore } from '@/lib/cart-store';
import type { Product, ProductVariant } from '@/types';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
  product: Product;
  selectedVariant?: ProductVariant;
  onVariantChange?: (variant: ProductVariant | undefined) => void;
}

// Static rating for display (can be made dynamic later)
const STATIC_RATING = 4.5;
const STATIC_REVIEW_COUNT = 128;

export function ProductInfo({
  product,
  selectedVariant,
  onVariantChange,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const currentPrice = selectedVariant?.price ?? product.price;
  const comparePrice = product.comparePrice;
  const hasDiscount = comparePrice && comparePrice > currentPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : 0;

  const inStock = (selectedVariant?.quantity ?? product.quantity) > 0;
  const stockCount = selectedVariant?.quantity ?? product.quantity;
  const isLowStock = inStock && stockCount <= 5;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= stockCount) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
    openCart();
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = product.name;

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Badge */}
      {product.category && (
        <Badge variant="outline" className="w-fit">
          {product.category.name}
        </Badge>
      )}

      {/* Product Name */}
      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                'h-4 w-4',
                star <= Math.floor(STATIC_RATING)
                  ? 'fill-yellow-400 text-yellow-400'
                  : star - STATIC_RATING < 1
                  ? 'fill-yellow-400/50 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {STATIC_RATING} ({STATIC_REVIEW_COUNT} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <motion.span
          key={currentPrice}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          ${currentPrice.toFixed(2)}
        </motion.span>
        {hasDiscount && (
          <>
            <span className="text-xl text-gray-500 line-through">
              ${comparePrice.toFixed(2)}
            </span>
            <Badge variant="destructive" className="text-sm">
              -{discountPercentage}% OFF
            </Badge>
          </>
        )}
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-gray-600">{product.shortDescription}</p>
      )}

      <Separator />

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {!inStock ? (
          <Badge variant="destructive">Out of Stock</Badge>
        ) : isLowStock ? (
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            Only {stockCount} left in stock
          </Badge>
        ) : (
          <Badge variant="outline" className="border-green-500 text-green-500">
            <Check className="mr-1 h-3 w-3" />
            In Stock
          </Badge>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Quantity</label>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="h-10 w-10 rounded-r-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= stockCount}
              className="h-10 w-10 rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {inStock && (
            <span className="text-sm text-gray-500">
              {stockCount} available
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                {isAddedToCart ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {!inStock && (
              <TooltipContent>
                <p>This product is currently out of stock</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={handleWishlist}
              >
                <Heart
                  className={cn('h-5 w-5', isWishlisted && 'fill-red-500 text-red-500')}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Share2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleShare('facebook')}>
              <Facebook className="mr-2 h-4 w-4" />
              Share on Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('twitter')}>
              <Twitter className="mr-2 h-4 w-4" />
              Share on Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('copy')}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border bg-gray-50 p-4 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Free Shipping</p>
            <p className="text-xs text-gray-500">Orders over $100</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Secure Payment</p>
            <p className="text-xs text-gray-500">100% secure checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <RotateCcw className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Easy Returns</p>
            <p className="text-xs text-gray-500">30-day return policy</p>
          </div>
        </div>
      </div>

      {/* Full Description */}
      {product.description && (
        <div className="space-y-2">
          <h3 className="font-semibold">Description</h3>
          <div className="prose prose-sm max-w-none text-gray-600">
            {product.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* SKU */}
      <p className="text-sm text-gray-500">
        SKU: {selectedVariant?.sku ?? product.sku}
      </p>
    </div>
  );
}
