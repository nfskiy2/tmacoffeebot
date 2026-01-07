# Backend API Specifications

This document serves as the Source of Truth for the API Contracts between Frontend and Backend.
All schemas are strictly typed using Zod in `@tma/shared`.

## Entities

### Shop
- **Schema**: `ShopSchema`
- **Fields**:
  - `id`: UUID | String
  - `name`: String
  - `description`: String (Optional)
  - `address`: String (Optional)
  - `logoUrl`: URL
  - `currency`: String (Default: RUB)
  - `themeColor`: Hex String
  - `isClosed`: Boolean

### Product
- **Schema**: `ProductSchema`
- **Fields**:
  - `id`: String
  - `categoryId`: String
  - `name`: String
  - `price`: Integer (Cents)
  - `imageUrl`: URL
  - `addons`: Array of `ProductAddonSchema`

## API Endpoints

### GET /api/v1/shop
- **Headers**: `X-Shop-Id` (Required)
- **Response**: `Shop`

### GET /api/v1/categories
- **Headers**: `X-Shop-Id` (Required)
- **Response**: `Category[]`

### GET /api/v1/products
- **Headers**: `X-Shop-Id` (Required)
- **Response**: `{ items: Product[], total: number }`

### POST /api/v1/orders
- **Headers**: `X-Shop-Id` (Required)
- **Payload**: `OrderPayloadSchema`
- **Response**: `OrderSchema`

## Multi-tenancy
All requests (except `/api/v1/shops`) must include the `X-Shop-Id` header to identify the tenant.
