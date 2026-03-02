import { init } from '@instantdb/react';

// InstantDB App ID from environment
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || process.env.INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';

// Initialize InstantDB client
export const db = init({ appId: APP_ID });

// Admin token for server-side operations
export const ADMIN_TOKEN = process.env.INSTANT_APP_ADMIN_TOKEN || 'c89d31dd-c2fb-41fe-9e67-c0946668be33';

// Query helpers for common operations
export const queries = {
  // Products
  allProducts: () => db.useQuery({ 
    products: { 
      category: {} 
    } 
  }),
  
  featuredProducts: () => db.useQuery({ 
    products: { 
      $: { where: { featured: true, status: 'active' } },
      category: {} 
    } 
  }),
  
  productBySlug: (slug: string) => db.useQuery({ 
    products: { 
      $: { where: { slug } },
      category: {},
      variants: {}
    } 
  }),
  
  productsByCategory: (categoryId: string) => db.useQuery({ 
    products: { 
      $: { where: { category: categoryId } },
      category: {} 
    } 
  }),
  
  // Categories
  allCategories: () => db.useQuery({ 
    categories: {
      parent: {},
      children: {}
    }
  }),
  
  categoryBySlug: (slug: string) => db.useQuery({ 
    categories: { 
      $: { where: { slug } },
      parent: {},
      children: {},
      products: {}
    } 
  }),
  
  // Orders
  userOrders: (userId: string) => db.useQuery({ 
    orders: { 
      $: { where: { userId } },
      items: { product: {} }
    } 
  }),
  
  allOrders: () => db.useQuery({ 
    orders: { 
      $: { order: { createdAt: 'desc' } },
      user: {},
      items: { product: {} }
    } 
  }),
  
  // Testimonials
  approvedTestimonials: () => db.useQuery({ 
    testimonials: { 
      $: { where: { approved: true } }
    } 
  }),
  
  // Banners
  activeBanners: () => db.useQuery({ 
    promotionalBanners: { 
      $: { where: { active: true }, order: { order: 'asc' } }
    } 
  }),
  
  // Users
  userByEmail: (email: string) => db.useQuery({ 
    users: { 
      $: { where: { email } }
    } 
  }),
  
  userById: (id: string) => db.useQuery({ 
    users: {} 
  })
};

// Helper to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}
