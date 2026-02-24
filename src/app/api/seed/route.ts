import { NextResponse } from 'next/server';
import { queryDB, transactDB, id, updateOp } from '@/lib/instant-server';

// Sample product images
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

export async function POST() {
  try {
    const now = Date.now();

    // Create categories
    const categories = [
      { id: id(), name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronic devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
      { id: id(), name: 'Fashion', slug: 'fashion', description: 'Trendy clothing and accessories', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
      { id: id(), name: 'Home & Living', slug: 'home-living', description: 'Furniture and home decor', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' },
      { id: id(), name: 'Sports', slug: 'sports', description: 'Sports equipment and activewear', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
      { id: id(), name: 'Beauty', slug: 'beauty', description: 'Skincare, makeup, and beauty products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
    ];

    // Create products
    const products = [
      { id: id(), name: 'Premium Wireless Headphones', slug: 'premium-wireless-headphones', description: 'Crystal-clear audio with ANC', shortDescription: 'Crystal-clear audio', price: 299.99, comparePrice: 399.99, sku: 'WH-1000', quantity: 150, images: JSON.stringify([sampleImages[0]]), featured: true, status: 'active', categoryId: categories[0].id, tags: JSON.stringify(['headphones', 'wireless']) },
      { id: id(), name: 'Smart Watch Pro', slug: 'smart-watch-pro', description: 'Advanced fitness tracking', shortDescription: 'Fitness tracking', price: 449.99, comparePrice: 549.99, sku: 'SW-PRO', quantity: 85, images: JSON.stringify([sampleImages[1]]), featured: true, status: 'active', categoryId: categories[0].id, tags: JSON.stringify(['watch', 'smart']) },
      { id: id(), name: 'Designer Sunglasses', slug: 'designer-sunglasses', description: 'Premium UV protection', shortDescription: 'UV protection', price: 189.99, comparePrice: null, sku: 'SG-D01', quantity: 200, images: JSON.stringify([sampleImages[2]]), featured: false, status: 'active', categoryId: categories[1].id, tags: JSON.stringify(['sunglasses', 'fashion']) },
      { id: id(), name: 'Minimalist Backpack', slug: 'minimalist-backpack', description: 'Sleek everyday design', shortDescription: 'Sleek design', price: 129.99, comparePrice: 159.99, sku: 'BP-M01', quantity: 300, images: JSON.stringify([sampleImages[3]]), featured: true, status: 'active', categoryId: categories[1].id, tags: JSON.stringify(['backpack', 'travel']) },
      { id: id(), name: 'Organic Skincare Set', slug: 'organic-skincare-set', description: 'Natural skincare routine', shortDescription: 'Natural skincare', price: 79.99, comparePrice: 99.99, sku: 'SK-ORG', quantity: 175, images: JSON.stringify([sampleImages[5]]), featured: true, status: 'active', categoryId: categories[4].id, tags: JSON.stringify(['skincare', 'organic']) },
      { id: id(), name: 'Yoga Mat Premium', slug: 'yoga-mat-premium', description: 'Non-slip surface', shortDescription: 'Non-slip mat', price: 59.99, comparePrice: null, sku: 'YM-P01', quantity: 250, images: JSON.stringify([sampleImages[6]]), featured: false, status: 'active', categoryId: categories[3].id, tags: JSON.stringify(['yoga', 'fitness']) },
      { id: id(), name: 'Ceramic Vase Collection', slug: 'ceramic-vase-collection', description: 'Handcrafted elegance', shortDescription: 'Handcrafted', price: 49.99, comparePrice: 69.99, sku: 'VC-01', quantity: 120, images: JSON.stringify([sampleImages[7]]), featured: false, status: 'active', categoryId: categories[2].id, tags: JSON.stringify(['vase', 'home']) },
      { id: id(), name: 'Professional Camera Lens', slug: 'professional-camera-lens', description: 'Professional quality optics', shortDescription: 'Pro quality', price: 899.99, comparePrice: 1099.99, sku: 'CL-PRO', quantity: 45, images: JSON.stringify([sampleImages[4]]), featured: true, status: 'active', categoryId: categories[0].id, tags: JSON.stringify(['camera', 'lens']) },
    ];

    // Create testimonials
    const testimonials = [
      { id: id(), name: 'Sarah Johnson', role: 'Fashion Blogger', company: 'Style Weekly', content: 'Love the quality!', rating: 5, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', approved: true, email: '' },
      { id: id(), name: 'Michael Chen', role: 'Tech Enthusiast', company: 'Gadget Review', content: 'Exceeded expectations!', rating: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', approved: true, email: '' },
      { id: id(), name: 'Emily Rodriguez', role: 'Yoga Instructor', company: 'Zen Studio', content: 'Perfect for my practice!', rating: 5, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', approved: true, email: '' },
    ];

    // Create banners
    const banners = [
      { id: id(), title: 'Summer Sale', subtitle: 'Up to 50% off', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920', link: '/store?featured=true', buttonText: 'Shop Now', active: true, order: 1 },
      { id: id(), title: 'New Arrivals', subtitle: 'Latest collection', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920', link: '/store?sort=newest', buttonText: 'Explore', active: true, order: 2 },
    ];

    // Create admin user
    const adminUser = {
      id: id(),
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'a8f5f167f44f4964e6c998dee827110c',
      role: 'admin',
      image: null,
    };

    // Build transaction operations
    const operations: Array<{ action: 'update' | 'delete' | 'link' | 'unlink'; namespace: string; id: string; data?: object }> = [];

    // Categories
    for (const cat of categories) {
      operations.push(updateOp('categories', cat.id, { ...cat, parentId: null, createdAt: now, updatedAt: now }));
    }

    // Products
    for (const product of products) {
      operations.push(updateOp('products', product.id, { ...product, createdAt: now, updatedAt: now }));
    }

    // Testimonials
    for (const testimonial of testimonials) {
      operations.push(updateOp('testimonials', testimonial.id, { ...testimonial, createdAt: now }));
    }

    // Banners
    for (const banner of banners) {
      operations.push(updateOp('promotionalBanners', banner.id, { ...banner, createdAt: now }));
    }

    // Admin user
    operations.push(updateOp('users', adminUser.id, { ...adminUser, createdAt: now, updatedAt: now }));

    const { error } = await transactDB(operations);

    if (error) {
      return NextResponse.json(
        { success: false, error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        categories: categories.length,
        products: products.length,
        testimonials: testimonials.length,
        banners: banners.length,
        adminUser: { email: 'admin@example.com', password: 'admin123' },
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database', details: String(error) },
      { status: 500 }
    );
  }
}
