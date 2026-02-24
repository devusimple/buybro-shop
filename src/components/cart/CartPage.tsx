'use client';

import { useCartStore, useCartTotals } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { itemCount } = useCartTotals();

  if (items.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-16">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground mt-2">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/store">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <CartSummary />
              
              <div className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/store">
                    Continue Shopping
                  </Link>
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                <p>Secure checkout powered by Stripe</p>
                <p className="mt-1">Free shipping on orders over $100</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
