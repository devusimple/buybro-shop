'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Category } from '@/types';

interface ProductFiltersProps {
  selectedCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  onCategoryChange?: (category: string | undefined) => void;
  onPriceChange?: (min: number | undefined, max: number | undefined) => void;
  onClearFilters?: () => void;
}

interface CategoryWithCount extends Category {
  productCount?: number;
}

export function ProductFilters({
  selectedCategory,
  minPrice,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice ?? 0,
    maxPrice ?? 1000,
  ]);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = [
    selectedCategory,
    minPrice !== undefined || maxPrice !== undefined,
  ].filter(Boolean).length;

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setPriceRange([minPrice ?? 0, maxPrice ?? 1000]);
  }, [minPrice, maxPrice]);

  const handleCategorySelect = (categorySlug: string) => {
    if (selectedCategory === categorySlug) {
      onCategoryChange?.(undefined);
    } else {
      onCategoryChange?.(categorySlug);
    }
    setIsMobileSheetOpen(false);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handlePriceCommit = (values: number[]) => {
    onPriceChange?.(
      values[0] > 0 ? values[0] : undefined,
      values[1] < 1000 ? values[1] : undefined
    );
  };

  const handleClearFilters = () => {
    setPriceRange([0, 1000]);
    onClearFilters?.();
    setIsMobileSheetOpen(false);
  };

  // Render category tree recursively
  const renderCategoryItem = (category: CategoryWithCount, depth = 0) => (
    <div key={category.id} className="space-y-1">
      <div
        className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent ${
          selectedCategory === category.slug ? 'bg-accent' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <Checkbox
          id={`category-${category.id}`}
          checked={selectedCategory === category.slug}
          onCheckedChange={() => handleCategorySelect(category.slug)}
        />
        <label
          htmlFor={`category-${category.id}`}
          className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {category.name}
        </label>
        {category.productCount !== undefined && (
          <span className="text-xs text-muted-foreground">
            ({category.productCount})
          </span>
        )}
      </div>
      {category.children?.map((child) => renderCategoryItem(child, depth + 1))}
    </div>
  );

  // Filter content component (shared between desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories Filter */}
      <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-semibold">Categories</span>
          {isCategoryOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories available</p>
          ) : (
            <ScrollArea className="h-48 pr-4">
              <div className="space-y-1">
                {categories.map((category) => renderCategoryItem(category))}
              </div>
            </ScrollArea>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range Filter */}
      <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-semibold">Price Range</span>
          {isPriceOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Min</Label>
              <Input
                type="number"
                placeholder="$0"
                value={priceRange[0] || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setPriceRange([val, priceRange[1]]);
                  handlePriceCommit([val, priceRange[1]]);
                }}
                className="mt-1 h-8"
              />
            </div>
            <span className="mt-4">-</span>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Max</Label>
              <Input
                type="number"
                placeholder="$1000"
                value={priceRange[1] || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1000;
                  setPriceRange([priceRange[0], val]);
                  handlePriceCommit([priceRange[0], val]);
                }}
                className="mt-1 h-8"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Active Filters */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <span className="text-sm font-semibold">Active Filters</span>
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  Category: {categories.find((c) => c.slug === selectedCategory)?.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => onCategoryChange?.(undefined)}
                  />
                </Badge>
              )}
              {(minPrice !== undefined || maxPrice !== undefined) && (
                <Badge variant="secondary" className="gap-1">
                  Price: ${minPrice ?? 0} - ${maxPrice ?? 1000}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => onPriceChange?.(undefined, undefined)}
                  />
                </Badge>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-4 space-y-4 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filters</h3>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <ScrollArea className="mt-4 h-[calc(100vh-180px)]">
              <FilterContent />
            </ScrollArea>
            <SheetFooter className="mt-4 flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                onClick={() => setIsMobileSheetOpen(false)}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
