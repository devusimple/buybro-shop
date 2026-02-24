'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ProductVariant } from '@/types';
import { cn } from '@/lib/utils';

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onVariantChange: (variant: ProductVariant | undefined) => void;
  basePrice: number;
}

// Common color names to hex values mapping
const colorMap: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  purple: '#a855f7',
  pink: '#ec4899',
  brown: '#a5692a',
  gray: '#6b7280',
  grey: '#6b7280',
  navy: '#1e3a5f',
  beige: '#d4b896',
  khaki: '#c3b091',
  coral: '#ff7f50',
  teal: '#14b8a6',
  olive: '#808000',
  maroon: '#800000',
  silver: '#c0c0c0',
  gold: '#ffd700',
};

export function ProductVariants({
  variants,
  selectedVariant,
  onVariantChange,
  basePrice,
}: ProductVariantsProps) {
  // Extract unique option types (like Color, Size)
  const optionTypes = useMemo(() => {
    const types = new Set<string>();
    variants.forEach((variant) => {
      Object.keys(variant.options).forEach((key) => types.add(key));
    });
    return Array.from(types);
  }, [variants]);

  // Get available options for each type
  const getAvailableOptions = (optionType: string): string[] => {
    const options = new Set<string>();
    variants.forEach((variant) => {
      if (variant.options[optionType]) {
        options.add(variant.options[optionType]);
      }
    });
    return Array.from(options);
  };

  // Check if an option is available (in stock)
  const isOptionAvailable = (optionType: string, optionValue: string): boolean => {
    return variants.some(
      (variant) =>
        variant.options[optionType] === optionValue && variant.quantity > 0
    );
  };

  // Check if an option is out of stock
  const isOptionOutOfStock = (optionType: string, optionValue: string): boolean => {
    const matchingVariants = variants.filter(
      (variant) => variant.options[optionType] === optionValue
    );
    return matchingVariants.length > 0 && matchingVariants.every((v) => v.quantity <= 0);
  };

  // Get price adjustment for an option
  const getPriceAdjustment = (optionType: string, optionValue: string): number | null => {
    const variant = variants.find(
      (v) => v.options[optionType] === optionValue && v.price !== null
    );
    if (variant?.price) {
      return variant.price - basePrice;
    }
    return null;
  };

  // Handle option selection
  const handleOptionSelect = (optionType: string, optionValue: string) => {
    if (isOptionOutOfStock(optionType, optionValue)) return;

    // Find variant matching the selected option
    // For now, we'll use simple matching - in a real app, you'd need to handle multiple option types
    const matchingVariant = variants.find(
      (variant) => variant.options[optionType] === optionValue
    );

    if (matchingVariant) {
      onVariantChange(matchingVariant);
    }
  };

  // Check if an option type is a color
  const isColorOption = (optionType: string): boolean => {
    const lowerType = optionType.toLowerCase();
    return lowerType.includes('color') || lowerType.includes('colour');
  };

  // Get color hex value
  const getColorHex = (colorName: string): string => {
    const lowerName = colorName.toLowerCase().trim();
    return colorMap[lowerName] || '#cccccc';
  };

  if (variants.length === 0 || optionTypes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {optionTypes.map((optionType) => {
        const availableOptions = getAvailableOptions(optionType);
        const isColor = isColorOption(optionType);

        return (
          <div key={optionType} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium capitalize">
                {optionType}: <span className="font-normal text-gray-600">
                  {selectedVariant?.options[optionType] || 'Select'}
                </span>
              </Label>
            </div>

            {isColor ? (
              // Color swatches
              <div className="flex flex-wrap gap-2">
                {availableOptions.map((option) => {
                  const isSelected = selectedVariant?.options[optionType] === option;
                  const isOutOfStock = isOptionOutOfStock(optionType, option);
                  const colorHex = getColorHex(option);

                  return (
                    <TooltipProvider key={option}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleOptionSelect(optionType, option)}
                            disabled={isOutOfStock}
                            className={cn(
                              'relative h-10 w-10 rounded-full border-2 transition-all',
                              isSelected
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-gray-200 hover:border-gray-400',
                              isOutOfStock && 'cursor-not-allowed opacity-50'
                            )}
                            style={{ backgroundColor: colorHex }}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <Check
                                  className={cn(
                                    'h-5 w-5',
                                    colorHex.toLowerCase() === '#ffffff' || colorHex.toLowerCase() === '#ffffff'
                                      ? 'text-gray-900'
                                      : 'text-white'
                                  )}
                                />
                              </motion.div>
                            )}
                            {isOutOfStock && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <X className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{option}</p>
                          {isOutOfStock && (
                            <p className="text-xs text-red-500">Out of stock</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ) : (
              // Size/other buttons
              <div className="flex flex-wrap gap-2">
                {availableOptions.map((option) => {
                  const isSelected = selectedVariant?.options[optionType] === option;
                  const isOutOfStock = isOptionOutOfStock(optionType, option);
                  const priceAdjustment = getPriceAdjustment(optionType, option);

                  return (
                    <Button
                      key={option}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleOptionSelect(optionType, option)}
                      disabled={isOutOfStock}
                      className={cn(
                        'min-w-[48px]',
                        isOutOfStock && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      {option}
                      {priceAdjustment !== null && priceAdjustment !== 0 && (
                        <span className="ml-1 text-xs">
                          {priceAdjustment > 0 ? '+' : ''}
                          ${Math.abs(priceAdjustment).toFixed(2)}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Badge variant="secondary">
            {selectedVariant.name}
          </Badge>
          {selectedVariant.quantity <= 5 && selectedVariant.quantity > 0 && (
            <span className="text-sm text-orange-500">
              Only {selectedVariant.quantity} left
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}
