'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Printer,
  RotateCcw,
  Truck,
  Mail,
  Phone,
} from 'lucide-react';
import type { Order, OrderItem } from '@/types';

interface OrderDetailProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (orderId: string, status: string) => void;
}

const statusStyles: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  pending: { variant: 'secondary', label: 'Pending' },
  processing: { variant: 'default', label: 'Processing' },
  shipped: { variant: 'outline', label: 'Shipped' },
  delivered: { variant: 'default', label: 'Delivered' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
  refunded: { variant: 'destructive', label: 'Refunded' },
};

const paymentStatusStyles: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  pending: { variant: 'secondary', label: 'Pending' },
  paid: { variant: 'default', label: 'Paid' },
  failed: { variant: 'destructive', label: 'Failed' },
  refunded: { variant: 'outline', label: 'Refunded' },
};

// Mock order items
const mockItems: OrderItem[] = [
  {
    id: '1',
    orderId: '1',
    productId: '1',
    variantId: null,
    name: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    price: 199.99,
    quantity: 1,
    total: 199.99,
    image: '/products/headphones.jpg',
    createdAt: Date.now(),
  },
  {
    id: '2',
    orderId: '1',
    productId: '2',
    variantId: null,
    name: 'Smart Watch Pro',
    sku: 'SWP-002',
    price: 99.99,
    quantity: 1,
    total: 99.99,
    image: '/products/watch.jpg',
    createdAt: Date.now(),
  },
];

export function OrderDetail({ order, open, onOpenChange, onStatusChange }: OrderDetailProps) {
  const [status, setStatus] = useState(order?.status || 'pending');
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const items = order.items || mockItems;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus as Order['status']);
    setLoading(true);
    try {
      if (onStatusChange) {
        onStatusChange(order.id, newStatus);
      } else {
        await fetch(`/api/orders/${order.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = statusStyles[order.status] || statusStyles.pending;
  const paymentStyle = paymentStatusStyles[order.paymentStatus] || paymentStatusStyles.pending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Order {order.orderNumber}</DialogTitle>
              <DialogDescription>
                Placed on {formatDate(order.createdAt)}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badges */}
          <div className="flex items-center gap-2">
            <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
            <Badge variant={paymentStyle.variant}>{paymentStyle.label}</Badge>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg border"
                >
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right font-medium w-24">
                    {formatCurrency(item.total)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </h3>
              {order.shippingAddress && (
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  {order.shippingAddress.company && (
                    <p className="text-muted-foreground">{order.shippingAddress.company}</p>
                  )}
                  <p className="text-muted-foreground">
                    {order.shippingAddress.address1}
                  </p>
                  {order.shippingAddress.address2 && (
                    <p className="text-muted-foreground">
                      {order.shippingAddress.address2}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.country}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-2">
                      <Phone className="h-3 w-3" />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Billing Address */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-medium capitalize">{order.paymentMethod}</p>
                <p className="text-muted-foreground">
                  Payment Status: {paymentStyle.label}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Customer
            </h3>
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">{order.email}</p>
              {order.userId && (
                <p className="text-muted-foreground">Registered Customer</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
            <Button variant="outline" size="sm">
              <Truck className="h-4 w-4 mr-2" />
              Send Tracking
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Refund
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
