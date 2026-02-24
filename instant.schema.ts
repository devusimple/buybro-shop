// instant.schema.ts

import { i } from '@instantdb/react';

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
      name: i.string().optional(),
      image: i.string().optional(),
      role: i.string().optional(),
      createdAt: i.number().optional(),
      updatedAt: i.number().optional(),
    }),
    categories: i.entity({
      name: i.string().unique(),
      slug: i.string().unique(),
      description: i.string(),
      image: i.string(),
      parentId: i.string(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    products: i.entity({
      name: i.string().indexed(),
      slug: i.string().unique(),
      description: i.string(),
      shortDescription: i.string(),
      price: i.number(),
      comparePrice: i.number(),
      costPrice: i.number(),
      sku: i.string().unique(),
      barcode: i.string(),
      quantity: i.number(),
      weight: i.number(),
      images: i.string(),
      featured: i.boolean().indexed(),
      status: i.string().indexed(),
      tags: i.string(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    productVariants: i.entity({
      name: i.string(),
      sku: i.string(),
      price: i.number(),
      quantity: i.number(),
      options: i.string(),
      createdAt: i.number(),
    }),
    orders: i.entity({
      orderNumber: i.string().unique(),
      email: i.string().indexed(),
      status: i.string().indexed(),
      paymentStatus: i.string(),
      paymentMethod: i.string(),
      subtotal: i.number(),
      tax: i.number(),
      shipping: i.number(),
      discount: i.number(),
      total: i.number(),
      shippingAddress: i.string(),
      billingAddress: i.string(),
      notes: i.string(),
      createdAt: i.number().indexed(),
      updatedAt: i.number(),
    }),
    orderItems: i.entity({
      name: i.string(),
      sku: i.string(),
      price: i.number(),
      quantity: i.number(),
      total: i.number(),
      image: i.string(),
      createdAt: i.number(),
    }),
    testimonials: i.entity({
      name: i.string(),
      email: i.string(),
      role: i.string(),
      company: i.string(),
      content: i.string(),
      rating: i.number(),
      image: i.string(),
      approved: i.boolean().indexed(),
      createdAt: i.number(),
    }),
    newsletterSubscribers: i.entity({
      email: i.string().unique(),
      subscribed: i.boolean(),
      createdAt: i.number(),
    }),
    promotionalBanners: i.entity({
      title: i.string(),
      subtitle: i.string(),
      image: i.string(),
      link: i.string(),
      buttonText: i.string(),
      active: i.boolean().indexed(),
      order: i.number(),
      createdAt: i.number(),
    }),
  },
  links: {
    categoryProducts: {
      forward: { on: 'categories', has: 'many', label: 'products' },
      reverse: { on: 'products', has: 'one', label: 'category' },
    },
    categoryChildren: {
      forward: { on: 'categories', has: 'many', label: 'children' },
      reverse: { on: 'categories', has: 'one', label: 'parent' },
    },
    productVariantItems: {
      forward: { on: 'products', has: 'many', label: 'variants' },
      reverse: { on: 'productVariants', has: 'one', label: 'product' },
    },
    userOrders: {
      forward: { on: '$users', has: 'many', label: 'orders' },
      reverse: { on: 'orders', has: 'one', label: 'user' },
    },
    orderItems: {
      forward: { on: 'orders', has: 'many', label: 'items' },
      reverse: { on: 'orderItems', has: 'one', label: 'order' },
    },
    orderItemProduct: {
      forward: { on: 'orderItems', has: 'one', label: 'product' },
      reverse: { on: 'products', has: 'many', label: 'orderItems' },
    },
  },
});

// This helps TypeScript display better intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
