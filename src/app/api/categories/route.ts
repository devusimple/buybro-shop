import { NextRequest, NextResponse } from 'next/server';
import { queryDB, transactDB, id, updateOp } from '@/lib/instant-server';

// GET /api/categories - Get all categories
export async function GET() {
  try {
    // Query InstantDB for categories with their products
    const { result, error } = await queryDB({
      categories: {
        $: {},
        products: {},
        parent: {},
      },
    });

    if (error || !result) {
      console.error('InstantDB query error:', error);
      return NextResponse.json(
        { success: false, error: error || 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    const categories = result.categories || [];

    // Enrich categories with product count
    const enrichedCategories = categories.map((cat: Record<string, unknown>) => ({
      ...cat,
      productCount: Array.isArray(cat.products) ? cat.products.length : 0,
    }));

    return NextResponse.json({
      success: true,
      data: enrichedCategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      image,
      parentId,
    } = body;

    const categoryId = id();
    const now = Date.now();
    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create the category
    const { success, error } = await transactDB([
      updateOp('categories', categoryId, {
        name,
        slug: categorySlug,
        description: description || '',
        image: image || '',
        createdAt: now,
        updatedAt: now,
      }, parentId ? [{ entity: 'categories', id: parentId }] : undefined),
    ]);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: categoryId, slug: categorySlug },
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
