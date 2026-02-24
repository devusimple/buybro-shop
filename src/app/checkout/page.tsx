'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useCartStore } from '@/lib/cart-store';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/store');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  return <CheckoutForm />;
}
