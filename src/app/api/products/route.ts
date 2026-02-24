import { NextRequest, NextResponse } from 'next/server';
import type { Product, Category } from '@/types';

// Mock data store (in production, this would come from InstantDB)
const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronic devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: '2', name: 'Fashion', slug: 'fashion', description: 'Trendy clothing and accessories', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: '3', name: 'Home & Living', slug: 'home-living', description: 'Furniture and home decor', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: '4', name: 'Sports', slug: 'sports', description: 'Sports equipment and activewear', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  { id: '5', name: 'Beauty', slug: 'beauty', description: 'Skincare, makeup, and beauty products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
];

const sampleImages = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800',
  'https://images.unsplash.com/photo-1585155770913-5bca09b66794?w=800',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800',
];

const mockProducts: (Product & { category?: Category })[] = [
  { id: '1', name: 'Premium Wireless Headphones', slug: 'premium-wireless-headphones', description: 'Crystal-clear audio with ANC. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.', shortDescription: 'Crystal-clear audio', price: 299.99, comparePrice: 399.99, costPrice: 120, sku: 'WH-1000', barcode: '12345678', quantity: 150, weight: 0.5, images: [sampleImages[0]], featured: true, status: 'active', tags: ['headphones', 'wireless', 'audio'], createdAt: Date.now(), updatedAt: Date.now(), categoryId: '1', category: mockCategories[0] },
  { id: '2', name: 'Smart Watch Pro', slug: 'smart-watch-pro', description: 'Advanced fitness tracking. Features heart rate monitoring, GPS tracking, water resistance, and a stunning AMOLED display.', shortDescription: 'Fitness tracking', price: 449.99, comparePrice: 549.99, costPrice: 180, sku: 'SW-PRO', barcode: '12345679', quantity: 85, weight: 0.3, images: [sampleImages[1]], featured: true, status: 'active', tags: ['watch', 'smart', 'fitness'], createdAt: Date.now(), updatedAt: Date.now(), categoryId: '1', category: mockCategories[0] },
  { id: '3', name: 'Designer Sunglasses', slug: 'designer-sunglasses', description: 'Premium UV protection. Features UV400 protection, lightweight titanium frame, and scratch-resistant lenses.', shortDescription: 'UV protection', price: 189.99, comparePrice: null, costPrice: 75, sku: 'SG-D01', barcode: '12345680', quantity: 200, weight: 0.2, images: [sampleImages[2]], featured: false, status: 'active', tags: ['sunglasses', 'fashion'], createdAt: Date.now(), updatedAt: Date.now(), categoryId: '2', category: mockCategories[1] },
  { id: '4', name: 'Minimalist Backpack', slug: 'minimalist-backpack', description: 'Sleek everyday design. Features a 15.6" laptop compartment, water-resistant fabric, and ergonomic design.', shortDescription: 'Sleek design', price: 129.99, comparePrice: 159.99, costPrice: 52, sku: 'BP-M01', barcode: '12345681', quantity: 300, weight: 1.2, images: [sampleImages[3]], featured: true, status: 'active', tags: ['backpack', 'travel'], createdAt: Date.now(), updatedAt: Date.now(), categoryId: '2', category: mockCategories[1] },
  { id: '5', name: 'Organic Skincare Set', slug: 'organic-skincare-set', description: 'Natural skincare routine. Includes cleanser, toner, moisturizer, and face mask.', shortDescription: 'Natural skincare', price: 79.99, comparePrice: 99.99, costPrice: 32, sku: 'SK-ORG', barcode: '12345682', quantity: 175, weight: 0.8, images: [sampleImages[5]], featured: true, status: 'active', tags: ['skincare', 'organic'], createdAt: Date.now(), updatedAt: Date.now(), categoryId: '5', category: mockCategories[4] },
  { id: '6', name: 'Yoga Mat Premium', slug: 'yoga-mat-premium', description: 'Non-slip surface for perfect practice. Features extra cushioning and eco-friendly materials.', shortDescription: 'Non-slip mat', price: 59.99, comparePrice: null, costPrice: 24, sku: 'YM-P01', barcode: '12345683', quantity: 250, weight: 2.5, images: [sampleImages[6]], featured: false, status: 'active', tags: ['yoga', 'fitness'], createdAt: Date.now(), updatedAt: Date.now(), categoryId: '4', category: mockCategories[3] },
  { id: '7', name: 'Ceramic Vase Collection', slug: 'ceramic-vase-collection', description: 'Handcrafted elegance. Each piece is unique, available in various sizes and colors.', shortDescription: 'Handcrafted', price: 49.99, comparePrice: 69.99, costPrice: 20, sku: 'VC-01', barcode: '12345684', quantity: 120, weight: 1.5, images: [sampleImages[7]], featured: false, status: 'active', tags: ['vase', 'home'], createdAt: Date.now(), updatedAt: Date.now(), categoryId: '3', category: mockCategories[2] },
  { id: '8', name: 'Professional Camera Lens', slug: 'professional-camera-lens', description: 'Professional quality optics. Features advanced optics, fast autofocus, and weather-sealed construction.', shortDescription: 'Pro quality', price: 899.99, comparePrice: 1099.99, costPrice: 360, sku: 'CL-PRO', barcode: '12345685', quantity: 45, weight: 1.8, images: [sampleImages[4]], featured: true, status: 'active', tags: ['camera', 'lens'], createdAt: Date.now(), updatedAt: Date.now(), categoryId: '1', category: mockCategories[0] },
];

// GET /api/products - Get all products with filtering and sorting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured');
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    let products = [...mockProducts];

    // Apply filters
    if (category) {
      products = products.filter(p => p.category?.slug === category);
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    if (status) {
      products = products.filter(p => p.status === status);
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
    }

    // Pagination
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedProducts = products.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For demo, just return success
    return NextResponse.json({
      success: true,
      data: { id: `${Date.now()}` },
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
