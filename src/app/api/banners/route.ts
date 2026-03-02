import { NextRequest, NextResponse } from 'next/server';
import { queryDB, transactDB, id, updateOp, deleteOp } from '@/lib/instant-server';

// GET /api/banners - Get all banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    // Build query
    const query: Record<string, unknown> = {
      banners: {
        $: {
          order: {
            order: 'asc' as const,
          },
        },
      },
    };

    if (active === 'true') {
      (query.banners.$ as Record<string, unknown>).where = { active: true };
    }

    // Query InstantDB
    const { result, error } = await queryDB(query);

    if (error || !result) {
      console.error('InstantDB query error:', error);
      return NextResponse.json(
        { success: false, error: error || 'Failed to fetch banners' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.banners || [],
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST /api/banners - Create a new banner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, image, link, buttonText, active, order } = body;

    const bannerId = id();
    const now = Date.now();

    const { success, error } = await transactDB([
      updateOp('banners', bannerId, {
        title,
        subtitle: subtitle || '',
        image: image || '',
        link: link || '',
        buttonText: buttonText || '',
        active: active ?? true,
        order: parseInt(order) || 0,
        createdAt: now,
        updatedAt: now,
      }),
    ]);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to create banner' },
        { status: 500 }
      );
    }

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

// PUT /api/banners - Update a banner
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id: bannerId, ...updates } = body;

    const { success, error } = await transactDB([
      updateOp('banners', bannerId, {
        ...updates,
        updatedAt: Date.now(),
      }),
    ]);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to update banner' },
        { status: 500 }
      );
    }

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

// DELETE /api/banners - Delete a banner
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bannerId = searchParams.get('id');

    if (!bannerId) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const { success, error } = await transactDB([
      deleteOp('banners', bannerId),
    ]);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to delete banner' },
        { status: 500 }
      );
    }

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
