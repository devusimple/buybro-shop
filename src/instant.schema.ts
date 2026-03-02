// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  // We inferred 13 attributes!
  // Take a look at this schema, and if everything looks good,
  // run `push schema` again to enforce the types.
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $streams: i.entity({
      abortReason: i.string().optional(),
      clientId: i.string().unique().indexed(),
      done: i.boolean().optional(),
      size: i.number().optional(),
    }),
    $users: i.entity({
      createdAt: i.number().optional(),
      email: i.string().unique().indexed().optional(),
      image: i.string().optional(),
      imageURL: i.string().optional(),
      name: i.string().optional(),
      role: i.string().optional(),
      type: i.string().optional(),
      updatedAt: i.number().optional(),
    }),
    banners: i.entity({
      active: i.boolean().optional(),
      createdAt: i.number().optional(),
      image: i.string().optional(),
      link: i.string().optional(),
      subtitle: i.string().optional(),
      title: i.string().optional(),
    }),
    categories: i.entity({
      createdAt: i.number(),
      description: i.string(),
      image: i.string(),
      name: i.string().unique(),
      parentId: i.string(),
      slug: i.string().unique(),
      updatedAt: i.number(),
    }),
    newsletterSubscribers: i.entity({
      createdAt: i.number(),
      email: i.string().unique(),
      subscribed: i.boolean(),
    }),
    orderItems: i.entity({
      createdAt: i.number(),
      image: i.string(),
      name: i.string(),
      price: i.number(),
      quantity: i.number(),
      sku: i.string(),
      total: i.number(),
    }),
    orders: i.entity({
      billingAddress: i.string(),
      createdAt: i.number().indexed(),
      discount: i.number(),
      email: i.string().indexed(),
      notes: i.string(),
      orderNumber: i.string().unique(),
      paymentMethod: i.string(),
      paymentStatus: i.string(),
      shipping: i.number(),
      shippingAddress: i.string(),
      status: i.string().indexed(),
      subtotal: i.number(),
      tax: i.number(),
      total: i.number(),
      updatedAt: i.number(),
    }),
    products: i.entity({
      barcode: i.string(),
      categoryId: i.string().optional(),
      compareAtPrice: i.number().optional(),
      comparePrice: i.number(),
      costPrice: i.number(),
      createdAt: i.number(),
      description: i.string(),
      featured: i.boolean().indexed(),
      images: i.string(),
      name: i.string().indexed(),
      price: i.number(),
      quantity: i.number(),
      rating: i.number().optional(),
      reviewCount: i.number().optional(),
      shortDescription: i.string(),
      sku: i.string().unique(),
      slug: i.string().unique(),
      status: i.string().indexed(),
      stock: i.number().optional(),
      tags: i.string(),
      updatedAt: i.number(),
      weight: i.number(),
    }),
    productVariants: i.entity({
      createdAt: i.number(),
      name: i.string(),
      options: i.string(),
      price: i.number(),
      quantity: i.number(),
      sku: i.string(),
    }),
    promotionalBanners: i.entity({
      active: i.boolean().indexed(),
      buttonText: i.string(),
      createdAt: i.number(),
      image: i.string(),
      link: i.string(),
      order: i.number(),
      subtitle: i.string(),
      title: i.string(),
    }),
    testimonials: i.entity({
      approved: i.boolean().indexed(),
      avatar: i.string().optional(),
      company: i.string(),
      content: i.string(),
      createdAt: i.number(),
      email: i.string(),
      image: i.string(),
      name: i.string(),
      rating: i.number(),
      role: i.string(),
      text: i.string().optional(),
    }),
  },
  links: {
    $streams$files: {
      forward: {
        on: "$streams",
        has: "many",
        label: "$files",
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "$stream",
        onDelete: "cascade",
      },
    },
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    $usersOrders: {
      forward: {
        on: "$users",
        has: "many",
        label: "orders",
      },
      reverse: {
        on: "orders",
        has: "one",
        label: "user",
      },
    },
    categoriesChildren: {
      forward: {
        on: "categories",
        has: "many",
        label: "children",
      },
      reverse: {
        on: "categories",
        has: "one",
        label: "parent",
      },
    },
    categoriesProducts: {
      forward: {
        on: "categories",
        has: "many",
        label: "products",
      },
      reverse: {
        on: "products",
        has: "one",
        label: "category",
      },
    },
    orderItemsProduct: {
      forward: {
        on: "orderItems",
        has: "one",
        label: "product",
      },
      reverse: {
        on: "products",
        has: "many",
        label: "orderItems",
      },
    },
    ordersItems: {
      forward: {
        on: "orders",
        has: "many",
        label: "items",
      },
      reverse: {
        on: "orderItems",
        has: "one",
        label: "order",
      },
    },
    productsVariants: {
      forward: {
        on: "products",
        has: "many",
        label: "variants",
      },
      reverse: {
        on: "productVariants",
        has: "one",
        label: "product",
      },
    },
  },
  rooms: {},
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
