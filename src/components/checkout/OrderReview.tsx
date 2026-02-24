'use client';

import { useCartStore, useCartTotals } from '@/lib/cart-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, CreditCard, Package } from 'lucide-react';
import type { Address } from '@/types';

interface OrderReviewProps {
  shippingAddress: Address;
  paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
}

export function OrderReview({ shippingAddress, paymentInfo }: OrderReviewProps) {
  const items = useCartStore((state) => state.items);
  const { subtotal, tax, shipping, total } = useCartTotals();

  const maskedCardNumber = `•••• •••• •••• ${paymentInfo.cardNumber.slice(-4)}`;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>

      <div className="space-y-6">
        {/* Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4" />
              Order Items ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">{item.variant.name}</p>
                    )}
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    ${((item.variant?.price ?? item.product.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {shippingAddress.firstName} {shippingAddress.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {shippingAddress.address1}
              {shippingAddress.address2 && `, ${shippingAddress.address2}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </p>
            <p className="text-sm text-muted-foreground">{shippingAddress.country}</p>
            <p className="text-sm text-muted-foreground">{shippingAddress.phone}</p>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{paymentInfo.cardholderName}</p>
            <p className="text-sm text-muted-foreground">{maskedCardNumber}</p>
            <p className="text-sm text-muted-foreground">Expires: {paymentInfo.expiryDate}</p>
          </CardContent>
        </Card>

        {/* Order Totals */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
