
import { z } from 'zod';

// --- Shared Types ---

export const ShopIdSchema = z.string().uuid().or(z.string()); // Allowing simple string for mocks

// --- Enums ---

export const OrderStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']);
export const OrderTypeSchema = z.enum(['DINE_IN', 'TAKEOUT', 'DELIVERY']);
export const PaymentMethodSchema = z.enum(['CARD_ONLINE', 'CARD_OFFLINE', 'CASH']);

// --- Entity Schemas ---

export const ShopSchema = z.object({
  id: ShopIdSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().url(),
  bannerUrl: z.string().url().optional(),
  currency: z.string().default('RUB'),
  themeColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default('#000000'),
  isClosed: z.boolean().default(false),
  openingHours: z.string().default("09:00 - 21:00"),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  iconUrl: z.string().url().optional(),
  sortOrder: z.number().default(0),
});

export const ProductAddonSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().int().default(0), // Price in cents/kopecks
  group: z.string().optional(), 
});

export const ProductSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().int().min(0), // Price in cents/kopecks
  imageUrl: z.string().url(),
  isAvailable: z.boolean().default(true),
  addons: z.array(ProductAddonSchema).optional(),
  subcategory: z.string().optional(), 
});

export const BannerSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  actionUrl: z.string().optional(),
  textColor: z.string().optional().default('#ffffff'),
});

// --- Cart & Order Schemas ---

export const CartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
  selectedAddons: z.array(z.string()).optional(), // Array of Addon IDs
});

// The Payload sent TO the backend
export const OrderPayloadSchema = z.object({
  shopId: ShopIdSchema,
  type: OrderTypeSchema, 
  paymentMethod: PaymentMethodSchema,
  requestedTime: z.string().optional(),
  items: z.array(CartItemSchema).min(1),
  comment: z.string().optional(),
  deliveryAddress: z.string().optional(), 
});

// The Response received FROM the backend
export const OrderSchema = z.object({
  id: z.string(),
  shopId: ShopIdSchema,
  status: OrderStatusSchema,
  type: OrderTypeSchema.optional(),
  items: z.array(CartItemSchema),
  totalAmount: z.number().int().min(0),
  comment: z.string().optional(),
  createdAt: z.string().datetime().optional(), 
});

// --- API List Responses ---

export const ProductListResponseSchema = z.object({
  items: z.array(ProductSchema),
  total: z.number(),
});
