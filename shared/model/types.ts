
import { z } from 'zod';
import { 
  ShopSchema, 
  ProductSchema, 
  CategorySchema, 
  CartItemSchema,
  OrderPayloadSchema,
  OrderSchema,
  OrderStatusSchema
} from '../../packages/shared/schemas';

// Domain Entities
export type Shop = z.infer<typeof ShopSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

// Feature / Interaction Types
export type CartItem = z.infer<typeof CartItemSchema>;
export type OrderPayload = z.infer<typeof OrderPayloadSchema>;
