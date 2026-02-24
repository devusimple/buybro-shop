import { NextRequest, NextResponse } from 'next/server';
import type { Category } from '@/types';

// Mock categories data
const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronic devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: '2', name: 'Fashion', slug: 'fashion', description: 'Trendy clothing and accessories', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: '3', name: 'Home & Living', slug: 'home-living', description: 'Furniture and home decor', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: '4', name: 'Sports', slug: 'sports', description: 'Sports equipment and activewear', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: '5', name: 'Beauty', slug: 'beauty', description: 'Skincare, makeup, and beauty products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
];

// GET /api/categories - Get all categories
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockCategories,
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
    
    return NextResponse.json({
      success: true,
      data: { id: `${Date.now()}` },
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
