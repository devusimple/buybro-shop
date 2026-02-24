import { NextRequest, NextResponse } from 'next/server';
import { init, tx } from '@instantdb/core';
import type { Product, Category, ProductVariant } from '@/types';

const APP_ID = process.env.INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';
const db = init({ appId: APP_ID });

// GET /api/products/[id] - Get a single product by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    const result = await db.query({
      products: {
        $: { where: { or: [{ id: productId }, { slug: productId }] } },
        category: {},
        variants: {},
      },
    });

    const product = (result.products?.[0] as (Product & { category?: Category; variants?: ProductVariant[] }) | undefined);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const productWithParsedData = {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images as unknown as string) : product.images,
      tags: typeof product.tags === 'string' ? JSON.parse(product.tags as unknown as string) : product.tags,
      variants: product.variants?.map(v => ({
        ...v,
        options: typeof v.options === 'string' ? JSON.parse(v.options as unknown as string) : v.options,
      })),
    };

    return NextResponse.json({
      success: true,
      data: productWithParsedData,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      ...body,
      updatedAt: Date.now(),
    };

    // Handle JSON fields
    if (body.images) {
      updateData.images = JSON.stringify(body.images);
    }
    if (body.tags) {
      updateData.tags = JSON.stringify(body.tags);
    }
    if (body.price) {
      updateData.price = parseFloat(body.price);
    }
    if (body.comparePrice) {
      updateData.comparePrice = parseFloat(body.comparePrice);
    }
    if (body.quantity) {
      updateData.quantity = parseInt(body.quantity);
    }

    await db.transact(tx.products[productId].update(updateData));

    // Update category link if provided
    if (body.categoryId !== undefined) {
      if (body.categoryId) {
        await db.transact(tx.products[productId].link({ category: body.categoryId }));
      } else {
        await db.transact(tx.products[productId].unlink({ category: {} }));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;

    await db.transact(tx.products[productId].delete());

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
