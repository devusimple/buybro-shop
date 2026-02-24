import { NextRequest, NextResponse } from 'next/server';
import { init, id, tx } from '@instantdb/core';
import type { Order, OrderItem, Address } from '@/types';

const APP_ID = process.env.INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';
const db = init({ appId: APP_ID });

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// GET /api/orders - Get orders (user's orders or all for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    const result = await db.query({
      orders: {
        user: {},
        items: {
          product: {},
        },
      },
    });

    let orders = result.orders || [];

    // Filter by user
    if (userId) {
      orders = orders.filter((o: Order) => o.userId === userId);
    }

    // Filter by email (for guest orders)
    if (email) {
      orders = orders.filter((o: Order) => o.email === email);
    }

    // Filter by status
    if (status) {
      orders = orders.filter((o: Order) => o.status === status);
    }

    // Sort by date
    orders.sort((a: Order, b: Order) => b.createdAt - a.createdAt);

    // Parse JSON fields
    const ordersWithParsedData = orders.map((order: Order) => ({
      ...order,
      shippingAddress: typeof order.shippingAddress === 'string' 
        ? JSON.parse(order.shippingAddress as unknown as string) 
        : order.shippingAddress,
      billingAddress: typeof order.billingAddress === 'string' 
        ? JSON.parse(order.billingAddress as unknown as string) 
        : order.billingAddress,
    }));

    return NextResponse.json({
      success: true,
      data: ordersWithParsedData,
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
      userId,
      email,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      notes,
    } = body;

    const orderId = id();
    const orderNumber = generateOrderNumber();
    const now = Date.now();

    // Create order
    await db.transact(
      tx.orders[orderId].update({
        orderNumber,
        userId: userId || null,
        email,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: paymentMethod || 'card',
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax) || 0,
        shipping: parseFloat(shipping) || 0,
        discount: parseFloat(discount) || 0,
        total: parseFloat(total),
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
        notes: notes || '',
        createdAt: now,
        updatedAt: now,
      })
    );

    // Link user if provided
    if (userId) {
      await db.transact(tx.orders[orderId].link({ user: userId }));
    }

    // Create order items
    for (const item of items) {
      const itemId = id();
      await db.transact(
        tx.orderItems[itemId].update({
          orderId,
          productId: item.productId || null,
          variantId: item.variantId || null,
          name: item.name,
          sku: item.sku || '',
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          total: parseFloat(item.price) * parseInt(item.quantity),
          image: item.image || '',
          createdAt: now,
        })
      );

      // Link to order
      await db.transact(tx.orderItems[itemId].link({ order: orderId }));

      // Link to product if provided
      if (item.productId) {
        await db.transact(tx.orderItems[itemId].link({ product: item.productId }));

        // Update product quantity
        const productResult = await db.query({
          products: { $: { where: { id: item.productId } } },
        });
        
        const product = productResult.products?.[0];
        if (product) {
          const newQuantity = Math.max(0, (product.quantity || 0) - parseInt(item.quantity));
          await db.transact(tx.products[item.productId].update({ quantity: newQuantity }));
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: { orderId, orderNumber },
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
