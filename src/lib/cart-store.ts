import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, ProductVariant } from '@/types';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getItem: (id: string) => CartItem | undefined;
  
  // UI State
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// Generate a unique ID for cart items
function generateCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}-${variantId}` : productId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, variant, quantity = 1) => {
        const id = generateCartItemId(product.id, variant?.id);
        const existingItem = get().items.find(item => item.id === id);
        
        if (existingItem) {
          // Update quantity if item exists
          set(state => ({
            items: state.items.map(item =>
              item.id === id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          // Add new item
          const newItem: CartItem = {
            id,
            productId: product.id,
            variantId: variant?.id,
            product,
            variant,
            quantity,
          };
          set(state => ({
            items: [...state.items, newItem],
          }));
        }
      },
      
      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.variant?.price ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
      },
      
      getItem: (id) => {
        return get().items.find(item => item.id === id);
      },
      
      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },
      
      openCart: () => {
        set({ isOpen: true });
      },
      
      closeCart: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: 'ecommerce-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Hook to get cart totals
export function useCartTotals() {
  const items = useCartStore(state => state.items);
  
  const subtotal = items.reduce((total, item) => {
    const price = item.variant?.price ?? item.product.price;
    return total + price * item.quantity;
  }, 0);
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate tax (example: 10%)
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  
  // Calculate shipping (example: free over $100, otherwise $10)
  const shipping = subtotal > 100 ? 0 : 10;
  
  // Total
  const total = subtotal + tax + shipping;
  
  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
  };
}
