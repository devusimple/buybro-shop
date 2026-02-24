'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  ShoppingCart,
  MoreHorizontal,
  Eye,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import type { Order } from '@/types';

interface OrderListProps {
  orders?: Order[];
  onViewOrder?: (order: Order) => void;
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

// Mock orders data
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

export function OrderList({ orders: externalOrders, onViewOrder }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>(externalOrders || mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Fetch orders
  useEffect(() => {
    if (!externalOrders) {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/orders');
          const data = await response.json();
          if (data.success) {
            setOrders(data.data);
          }
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [externalOrders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(searchLower) ||
          o.email.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      result = result.filter((o) => o.paymentStatus === paymentFilter);
    }

    // Sort by date (newest first)
    result.sort((a, b) => b.createdAt - a.createdAt);

    return result;
  }, [orders, search, statusFilter, paymentFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Orders
          </CardTitle>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order # or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => {
                    const statusStyle = statusStyles[order.status] || statusStyles.pending;
                    const paymentStyle = paymentStatusStyles[order.paymentStatus] || paymentStatusStyles.pending;
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{getCustomerName(order)}</p>
                            <p className="text-xs text-muted-foreground">{order.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusStyle.variant}>{statusStyle.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-3 w-3 text-muted-foreground" />
                            <Badge variant={paymentStyle.variant}>{paymentStyle.label}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(order.total)}
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onViewOrder?.(order)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(page * itemsPerPage, filteredOrders.length)} of{' '}
                  {filteredOrders.length} orders
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
