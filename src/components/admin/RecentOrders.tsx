'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import type { Order } from '@/types';

interface RecentOrdersProps {
  orders?: Order[];
}

const statusStyles: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  pending: { variant: 'secondary', label: 'Pending' },
  processing: { variant: 'default', label: 'Processing' },
  shipped: { variant: 'outline', label: 'Shipped' },
  delivered: { variant: 'default', label: 'Delivered' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
  refunded: { variant: 'destructive', label: 'Refunded' },
};

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    email: 'john@example.com',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotal: 299.99,
    tax: 24.00,
    shipping: 10.00,
    discount: 0,
    total: 333.99,
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
    },
    billingAddress: null,
    notes: null,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    userId: null,
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    email: 'jane@example.com',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'paypal',
    subtotal: 149.50,
    tax: 12.00,
    shipping: 5.00,
    discount: 10.00,
    total: 156.50,
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      address1: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'US',
    },
    billingAddress: null,
    notes: null,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
    userId: null,
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    email: 'mike@example.com',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'card',
    subtotal: 89.99,
    tax: 7.20,
    shipping: 0,
    discount: 0,
    total: 97.19,
    shippingAddress: {
      firstName: 'Mike',
      lastName: 'Johnson',
      address1: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'US',
    },
    billingAddress: null,
    notes: null,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
    userId: null,
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    email: 'sarah@example.com',
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotal: 459.00,
    tax: 36.72,
    shipping: 15.00,
    discount: 50.00,
    total: 460.72,
    shippingAddress: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      address1: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'US',
    },
    billingAddress: null,
    notes: null,
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now() - 345600000,
    userId: null,
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    email: 'david@example.com',
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'paypal',
    subtotal: 199.99,
    tax: 16.00,
    shipping: 0,
    discount: 0,
    total: 215.99,
    shippingAddress: {
      firstName: 'David',
      lastName: 'Brown',
      address1: '555 Maple Ave',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'US',
    },
    billingAddress: null,
    notes: null,
    createdAt: Date.now() - 432000000,
    updatedAt: Date.now() - 432000000,
    userId: null,
  },
];

export function RecentOrders({ orders }: RecentOrdersProps) {
  const displayOrders = orders || mockOrders;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getCustomerName = (order: Order) => {
    if (order.shippingAddress) {
      return `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;
    }
    return order.email;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayOrders.map((order) => {
              const statusStyle = statusStyles[order.status] || statusStyles.pending;
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{getCustomerName(order)}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
