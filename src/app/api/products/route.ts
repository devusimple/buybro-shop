import { NextRequest, NextResponse } from 'next/server';
import { queryDB, transactDB, id, updateOp, deleteOp } from '@/lib/instant-server';
import db from '@/lib/db';

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


    // Build query for InstantDB
    const query: Record<string, any> = {
      products: {
        $: {
          where: {},
        },
        category: {},
      },
      categories: {},
    };
    
    // Apply status filter
    if (status) {
      (query.products.$.where as Record<string, unknown>).status = status;
    }

    // Apply featured filter
    if (featured === 'true') {
      (query.products.$.where as Record<string, unknown>).featured = true;
    }

    // Query InstantDB
    const { result, error } = await queryDB(query);

    if (error || !result) {
      console.error('InstantDB query error:', error);
      return NextResponse.json(
        { success: false, error: error || 'Failed to fetch products' },
        { status: 500 }
      );
    }

    let products = result.products || [];
    const categories = result.categories || [];

    // Create category lookup map
    const categoryMap = new Map(
      categories.map((cat: Record<string, unknown>) => [cat.id, cat])
    );

    // Enrich products with category data
    products = products.map((product: Record<string, unknown>) => {
      const productData = { ...product };
      
      // Parse JSON fields
      if (typeof productData.images === 'string') {
        try {
          productData.images = JSON.parse(productData.images as string);
        } catch {
          productData.images = [];
        }
      }
      if (typeof productData.tags === 'string') {
        try {
          productData.tags = JSON.parse(productData.tags as string);
        } catch {
          productData.tags = [];
        }
      }

      // Add category data
      if (product.category) {
        const catData = product.category as Record<string, unknown>;
        productData.category = catData;
      } else if (product.categoryId) {
        productData.category = categoryMap.get(product.categoryId as string);
      }

      return productData;
    });

    // Apply category filter (by slug)
    if (category) {
      products = products.filter((p: Record<string, unknown>) => 
        (p.category as Record<string, unknown>)?.slug === category
      );
    }

    // Apply price filters
    if (minPrice) {
      products = products.filter((p: Record<string, unknown>) => 
        (p.price as number) >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      products = products.filter((p: Record<string, unknown>) => 
        (p.price as number) <= parseFloat(maxPrice)
      );
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter((p: Record<string, unknown>) => 
        (p.name as string)?.toLowerCase().includes(searchLower) ||
        (p.description as string)?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        products.sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
          (a.price as number) - (b.price as number)
        );
        break;
      case 'price_desc':
        products.sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
          (b.price as number) - (a.price as number)
        );
        break;
      case 'name_asc':
        products.sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
          (a.name as string).localeCompare(b.name as string)
        );
        break;
      case 'name_desc':
        products.sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
          (b.name as string).localeCompare(a.name as string)
        );
        break;
      case 'newest':
      default:
        products.sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
          (b.createdAt as number) - (a.createdAt as number)
        );
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
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      comparePrice,
      costPrice,
      sku,
      barcode,
      quantity,
      weight,
      images,
      featured = false,
      status = 'active',
      tags,
      categoryId,
    } = body;

    const productId = id();
    const now = Date.now();
    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create the product
    const { success, error } = await transactDB([
      updateOp('products', productId, {
        name,
        slug: productSlug,
        description: description || '',
        shortDescription: shortDescription || '',
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sku: sku || '',
        barcode: barcode || '',
        quantity: parseInt(quantity) || 0,
        weight: weight ? parseFloat(weight) : null,
        images: JSON.stringify(images || []),
        featured,
        status,
        tags: JSON.stringify(tags || []),
        createdAt: now,
        updatedAt: now,
      }, categoryId ? [{ entity: 'categories', id: categoryId }] : undefined),
    ]);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: productId, slug: productSlug },
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
