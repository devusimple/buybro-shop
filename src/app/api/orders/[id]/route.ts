import { NextRequest, NextResponse } from 'next/server';
import { init, tx } from '@instantdb/core';
import type { Order } from '@/types';

const APP_ID = process.env.INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';
const db = init({ appId: APP_ID });

// GET /api/orders/[id] - Get a single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    const result = await db.query({
      orders: {
        $: { where: { or: [{ id: orderId }, { orderNumber: orderId }] } },
        user: {},
        items: {
          product: {},
        },
      },
    });

    const order = result.orders?.[0] as Order | undefined;

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const orderWithParsedData = {
      ...order,
      shippingAddress: typeof order.shippingAddress === 'string' 
        ? JSON.parse(order.shippingAddress as unknown as string) 
        : order.shippingAddress,
      billingAddress: typeof order.billingAddress === 'string' 
        ? JSON.parse(order.billingAddress as unknown as string) 
        : order.billingAddress,
    };

    return NextResponse.json({
      success: true,
      data: orderWithParsedData,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update order status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      ...body,
      updatedAt: Date.now(),
    };

    await db.transact(tx.orders[orderId].update(updateData));

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
