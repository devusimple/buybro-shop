import { NextRequest, NextResponse } from 'next/server';
import { queryDB, transactDB, id, updateOp, deleteOp } from '@/lib/instant-server';

// GET /api/testimonials - Get all testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');

    // Build query
    const query: Record<string, unknown> = {
      testimonials: {
        $: {
          order: {
            createdAt: 'desc' as const,
          },
        },
      },
    };

    if (approved === 'true') {
      (query.testimonials.$ as Record<string, unknown>).where = { approved: true };
    }

    // Query InstantDB
    const { result, error } = await queryDB(query);

    if (error || !result) {
      console.error('InstantDB query error:', error);
      return NextResponse.json(
        { success: false, error: error || 'Failed to fetch testimonials' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.testimonials || [],
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create a new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, content, rating, avatar } = body;

    const testimonialId = id();
    const now = Date.now();

    const { success, error } = await transactDB([
      updateOp('testimonials', testimonialId, {
        name,
        role: role || '',
        content,
        rating: parseInt(rating) || 5,
        avatar: avatar || '',
        approved: false, // Requires admin approval
        createdAt: now,
      }),
    ]);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to create testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: testimonialId },
      message: 'Testimonial submitted successfully. It will be reviewed before publishing.',
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials - Update testimonial (approve/reject)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id: testimonialId, approved } = body;

    const { success, error } = await transactDB([
      updateOp('testimonials', testimonialId, {
        approved,
      }),
    ]);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to update testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE /api/testimonials - Delete a testimonial
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testimonialId = searchParams.get('id');

    if (!testimonialId) {
      return NextResponse.json(
        { success: false, error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    const { success, error } = await transactDB([
      deleteOp('testimonials', testimonialId),
    ]);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to delete testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
