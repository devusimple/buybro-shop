'use client';

import { useCartTotals } from '@/lib/cart-store';

interface CartSummaryProps {
  showTitle?: boolean;
}

export function CartSummary({ showTitle = true }: CartSummaryProps) {
  const { subtotal, tax, shipping, total } = useCartTotals();

  return (
    <div className="space-y-3">
      {showTitle && <h3 className="font-semibold text-lg">Order Summary</h3>}
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        {shipping === 0 && subtotal > 0 && (
          <p className="text-xs text-green-600">
            🎉 Free shipping on orders over $100!
          </p>
        )}
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
