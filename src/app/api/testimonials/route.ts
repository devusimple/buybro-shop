import { NextRequest, NextResponse } from 'next/server';
import { init, id, tx } from '@instantdb/core';
import type { Testimonial } from '@/types';

const APP_ID = process.env.INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';
const db = init({ appId: APP_ID });

// GET /api/testimonials - Get approved testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');

    const whereClause = approved === 'false' ? {} : { approved: true };

    const result = await db.query({
      testimonials: {
        $: { where: whereClause },
      },
    });

    const testimonials = (result.testimonials || []) as Testimonial[];

    // Sort by date
    testimonials.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({
      success: true,
      data: testimonials,
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
    const { name, email, role, company, content, rating, image } = body;

    const testimonialId = id();
    const now = Date.now();

    await db.transact(
      tx.testimonials[testimonialId].update({
        name,
        email: email || '',
        role: role || '',
        company: company || '',
        content,
        rating: parseInt(rating) || 5,
        image: image || '',
        approved: false, // Require admin approval
        createdAt: now,
      })
    );

    return NextResponse.json({
      success: true,
      data: { id: testimonialId },
      message: 'Testimonial submitted for review',
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
