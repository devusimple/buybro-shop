import { NextRequest, NextResponse } from 'next/server';
import { init, id, tx } from '@instantdb/core';

const APP_ID = process.env.INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';
const db = init({ appId: APP_ID });

// GET /api/newsletter - Get all subscribers (admin)
export async function GET() {
  try {
    const result = await db.query({
      newsletterSubscribers: {},
    });

    return NextResponse.json({
      success: true,
      data: result.newsletterSubscribers || [],
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await db.query({
      newsletterSubscribers: {
        $: { where: { email } },
      },
    });

    if (existing.newsletterSubscribers && existing.newsletterSubscribers.length > 0) {
      // Update to subscribed
      const existingId = existing.newsletterSubscribers[0].id;
      await db.transact(
        tx.newsletterSubscribers[existingId].update({
          subscribed: true,
        })
      );
      
      return NextResponse.json({
        success: true,
        message: 'Resubscribed successfully',
      });
    }

    // Create new subscriber
    const subscriberId = id();
    await db.transact(
      tx.newsletterSubscribers[subscriberId].update({
        email,
        subscribed: true,
        createdAt: Date.now(),
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully',
    });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletter - Unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const existing = await db.query({
      newsletterSubscribers: {
        $: { where: { email } },
      },
    });

    if (existing.newsletterSubscribers && existing.newsletterSubscribers.length > 0) {
      const existingId = existing.newsletterSubscribers[0].id;
      await db.transact(
        tx.newsletterSubscribers[existingId].update({
          subscribed: false,
        })
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed successfully',
    });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
