// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'admin' | 'customer';
  createdAt: number;
  updatedAt: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
}

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  comparePrice: number | null;
  costPrice: number | null;
  sku: string;
  barcode: string | null;
  quantity: number;
  weight: number | null;
  images: string[]; // JSON array of Cloudinary URLs
  featured: boolean;
  status: 'active' | 'draft' | 'archived';
  tags: string[]; // JSON array of tags
  createdAt: number;
  updatedAt: number;
  category?: Category;
  categoryId?: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string | null;
  price: number | null;
  quantity: number;
  options: Record<string, string>; // JSON object of option name -> value
  createdAt: number;
  product?: Product;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string | null;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address | null;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
  user?: User | null;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  variantId: string | null;
  name: string;
  sku: string | null;
  price: number;
  quantity: number;
  total: number;
  image: string | null;
  createdAt: number;
  order?: Order;
  product?: Product;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  image: string | null;
  approved: boolean;
  createdAt: number;
}

// Newsletter types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed: boolean;
  createdAt: number;
}

// Promotional Banner types
export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  buttonText: string | null;
  active: boolean;
  order: number;
  createdAt: number;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

// Filter and sort types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'draft' | 'archived';
  featured?: boolean;
  inStock?: boolean;
  search?: string;
}

export type SortOption = 
  | 'newest' 
  | 'oldest' 
  | 'price_asc' 
  | 'price_desc' 
  | 'name_asc' 
  | 'name_desc'
  | 'bestselling';

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}


