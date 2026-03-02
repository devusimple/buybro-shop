import { NextRequest, NextResponse } from 'next/server';
import { queryDB, transactDB, id, updateOp } from '@/lib/instant-server';
import { generateOrderNumber } from '@/lib/instant-server';

// GET /api/orders - Get all orders or user's orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query for InstantDB
    const query: Record<string, unknown> = {
      orders: {
        $: {
          order: {
            createdAt: 'desc' as const,
          },
        },
        items: {
          product: {},
        },
        user: {},
      },
    };

    // Apply status filter
    if (status) {
      (query.orders.$ as Record<string, unknown>).where = { status };
    }

    // Query InstantDB
    const { result, error } = await queryDB(query);

    if (error || !result) {
      console.error('InstantDB query error:', error);
      return NextResponse.json(
        { success: false, error: error || 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    let orders = result.orders || [];

    // Filter by userId if provided
    if (userId) {
      orders = orders.filter((order: Record<string, unknown>) => {
        const orderUser = order.user as Record<string, unknown> | undefined;
        return orderUser?.id === userId;
      });
    }

    // Enrich orders with parsed data
    orders = orders.map((order: Record<string, unknown>) => {
      const orderData = { ...order };
      
      // Parse JSON fields
      if (typeof orderData.shippingAddress === 'string') {
        try {
          orderData.shippingAddress = JSON.parse(orderData.shippingAddress as string);
        } catch {
          orderData.shippingAddress = null;
        }
      }
      if (typeof orderData.billingAddress === 'string') {
        try {
          orderData.billingAddress = JSON.parse(orderData.billingAddress as string);
        } catch {
          orderData.billingAddress = null;
        }
      }

      // Calculate item totals
      if (Array.isArray(orderData.items)) {
        orderData.itemCount = orderData.items.reduce(
          (sum: number, item: Record<string, unknown>) => sum + (item.quantity as number || 0), 
          0
        );
      }

      return orderData;
    });

    // Pagination
    const total = orders.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedOrders = orders.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      subtotal,
      tax,
      shipping,
      total,
      userId,
      notes,
    } = body;

    const orderId = id();
    const orderNumber = generateOrderNumber();
    const now = Date.now();

    // Create order and order items
    const operations = [
      // Create the order
      updateOp('orders', orderId, {
        orderNumber,
        status: 'pending',
        paymentStatus: 'pending',
        subtotal: parseFloat(subtotal) || 0,
        tax: parseFloat(tax) || 0,
        shipping: parseFloat(shipping) || 0,
        total: parseFloat(total) || 0,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : '',
        notes: notes || '',
        createdAt: now,
        updatedAt: now,
      }, userId ? [{ entity: '$users', id: userId }] : undefined),
    ];

    // Create order items
    for (const item of items) {
      const itemId = id();
      operations.push(
        updateOp('orderItems', itemId, {
          quantity: item.quantity,
          price: parseFloat(item.price),
          total: parseFloat(item.price) * item.quantity,
          createdAt: now,
        }, [
          { entity: 'orders', id: orderId },
          { entity: 'products', id: item.productId },
        ])
      );
    }

    // Execute transaction
    const { success, error } = await transactDB(operations);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to create order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: orderId, orderNumber },
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
