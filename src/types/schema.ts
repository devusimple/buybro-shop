// Type exports for use in the app
export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  quantity: number;
  weight?: number;
  images?: string[];
  featured: boolean;
  status: 'active' | 'draft' | 'archived';
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  categoryId?: string;
  vendorId?: string;
};

export type Vendor = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  email?: string;
  phone?: string;
  address?: string;
  commission?: number;
  isActive: boolean;
  verified: boolean;
  createdAt: number;
  updatedAt: number;
  userId?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: number;
  updatedAt: number;
  parentId?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress?: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes?: string;
  createdAt: number;
  updatedAt: number;
  userId?: string;
};

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  total: number;
  createdAt: number;
  orderId: string;
  productId: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  avatar?: string;
  approved: boolean;
  createdAt: number;
};

export type Banner = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  buttonText?: string;
  active: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribed: boolean;
  createdAt: number;
};
