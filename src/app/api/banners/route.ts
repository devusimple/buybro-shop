import { NextRequest, NextResponse } from 'next/server';
import { init, id, tx } from '@instantdb/core';
import type { PromotionalBanner } from '@/types';

const APP_ID = process.env.INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';
const db = init({ appId: APP_ID });

// GET /api/banners - Get active banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    const whereClause = active === 'false' ? {} : { active: true };

    const result = await db.query({
      promotionalBanners: {
        $: { where: whereClause, order: { order: 'asc' } },
      },
    });

    const banners = (result.promotionalBanners || []) as PromotionalBanner[];

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST /api/banners - Create a new banner (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, image, link, buttonText, active, order } = body;

    const bannerId = id();
    const now = Date.now();

    await db.transact(
      tx.promotionalBanners[bannerId].update({
        title,
        subtitle: subtitle || '',
        image,
        link: link || '',
        buttonText: buttonText || '',
        active: active ?? true,
        order: order || 0,
        createdAt: now,
      })
    );

    return NextResponse.json({
      success: true,
      data: { id: bannerId },
      message: 'Banner created successfully',
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

// PUT /api/banners - Update banner
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    await db.transact(tx.promotionalBanners[id].update(updateData));

    return NextResponse.json({
      success: true,
      message: 'Banner updated successfully',
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// DELETE /api/banners - Delete banner
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    await db.transact(tx.promotionalBanners[id].delete());

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
