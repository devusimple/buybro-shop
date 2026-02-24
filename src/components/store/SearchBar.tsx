'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value?: string;
  onSearch?: (search: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value: controlledValue,
  onSearch,
  placeholder = 'Search products...',
  debounceMs = 300,
  className,
  autoFocus = false,
}: SearchBarProps) {
  // Use controlled value if provided, otherwise use internal state
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Determine the current value
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  // Debounced search
  const debouncedSearch = useCallback(
    (searchValue: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearch?.(searchValue);
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Update internal state only if uncontrolled
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    // Always trigger debounced search
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    // Update internal state only if uncontrolled
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onSearch?.('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
    if (e.key === 'Enter') {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      onSearch?.(currentValue);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors',
          isFocused && 'text-primary'
        )}
      />
      <Input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-10 pr-10"
      />
      {currentValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}

// Compact version for mobile or smaller spaces
export function SearchBarCompact({
  value,
  onSearch,
  placeholder = 'Search...',
  className,
}: SearchBarProps) {
  return (
    <SearchBar
      value={value}
      onSearch={onSearch}
      placeholder={placeholder}
      className={className}
      debounceMs={200}
    />
  );
}
