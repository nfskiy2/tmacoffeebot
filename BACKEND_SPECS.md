
# API Contract (Backend Specifications)

> **Status:** RC 1.0 (Ready for Implementation)
> **Protocol:** REST / JSON
> **Base URL:** `/api/v1`

## 🔐 Authentication & Multi-tenancy

### Headers
Every request (except health checks) MUST include the tenant identifier.

| Header | Value | Required | Description |
| :--- | :--- | :--- | :--- |
| `X-Shop-Id` | `UUID` or `String` | **YES** | The unique ID of the Coffee Shop (Tenant). Determines which database/menu to load. |
| `Content-Type` | `application/json` | YES | - |

---

## 📚 Data Types & Enums

### 1. Order Status (`OrderStatus`)
| Value | Description |
| :--- | :--- |
| `PENDING` | Order created, waiting for confirmation. |
| `CONFIRMED` | Shop accepted the order. |
| `COMPLETED` | Order fulfilled/picked up. |
| `CANCELLED` | Order cancelled. |

### 2. Order Type (`OrderType`)
| Value | Description |
| :--- | :--- |
| `DINE_IN` | Customer is eating inside. |
| `TAKEOUT` | Customer picks up "to go". |
| `DELIVERY` | Delivery by courier. |

### 3. Payment Method (`PaymentMethod`)
| Value | Description |
| :--- | :--- |
| `CARD_ONLINE` | Paid via TMA interface (Stripe/Provider). |
| `CARD_OFFLINE` | Will pay by card terminal upon receipt. |
| `CASH` | Will pay cash upon receipt. |

---

## 📡 Endpoints

### 1. Shop Configuration

#### Get Current Shop
Returns configuration for the shop identified by `X-Shop-Id`.

`GET /shop`

**Response (200 OK):**
```json
{
  "id": "shop_1",
  "name": "Coffee & Code",
  "description": "Best coffee in town",
  "address": "123 Tech Blvd",
  "logoUrl": "https://...",
  "bannerUrl": "https://...",
  "currency": "RUB",
  "themeColor": "#38bdf8",
  "isClosed": false,
  "openingHours": "09:00 - 22:00"
}
```

#### Get All Shops
Used for the "Select Location" screen.
*Note: This endpoint might optionally ignore `X-Shop-Id` or use a "global" ID.*

`GET /shops`

**Response (200 OK):**
```json
[
  { "id": "shop_1", "name": "...", ... },
  { "id": "shop_2", "name": "...", ... }
]
```

---

### 2. Products & Menu

#### Get Categories
Returns active categories sorted by `sortOrder`.

`GET /categories`

**Response (200 OK):**
```json
[
  {
    "id": "cat_1",
    "name": "Coffee",
    "slug": "coffee",
    "iconUrl": "...",
    "sortOrder": 0
  }
]
```

#### Get Products
Returns products for the current shop.

`GET /products`

**Query Parameters:**
- `categoryId` (Optional): Filter by category.
- `ids` (Optional): Comma-separated list of IDs (e.g., `prod_1,prod_2`).

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "prod_1",
      "categoryId": "cat_1",
      "name": "Cappuccino",
      "description": "...",
      "price": 45000, // INTEGER (Cents/Kopecks)
      "imageUrl": "...",
      "isAvailable": true,
      "subcategory": "Milk Coffee",
      "addons": [
        { 
          "id": "add_1", 
          "name": "Almond Milk", 
          "price": 5000, // +50.00
          "group": "Milk" 
        }
      ]
    }
  ],
  "total": 1
}
```

#### Get Single Product
`GET /products/:id`

**Response (200 OK):**
Returns single `Product` object (same structure as item in list).

---

### 3. Marketing

#### Get Banners
`GET /banners`

**Response (200 OK):**
```json
[
  {
    "id": "ban_1",
    "title": "Lunch Time",
    "description": "...",
    "imageUrl": "...",
    "actionUrl": "category://food",
    "textColor": "#ffffff"
  }
]
```

---

### 4. Order Processing

#### Create Order
Submit a new order. 
**IMPORTANT:** The backend MUST recalculate the total price based on product IDs and Addon IDs to prevent price tampering. Do not trust a `totalAmount` sent from frontend.

`POST /orders`

**Request Body:**
```json
{
  "shopId": "shop_1",
  "type": "DINE_IN", // Enum: DINE_IN | TAKEOUT | DELIVERY
  "paymentMethod": "CARD_ONLINE", // Enum: CARD_ONLINE | CARD_OFFLINE | CASH
  "requestedTime": "ASAP", // or "12:30"
  "items": [
    {
      "productId": "prod_1",
      "quantity": 2,
      "selectedAddons": ["add_1", "add_3"] // Array of Addon IDs
    }
  ],
  "comment": "Extra hot",
  "deliveryAddress": "Optional (Required if type=DELIVERY)"
}
```

**Response (201 Created):**
```json
{
  "id": "ord_8812",
  "shopId": "shop_1",
  "status": "PENDING",
  "type": "DINE_IN",
  "items": [...], // Echo back items
  "totalAmount": 95000, // Calculated by Backend
  "createdAt": "2023-10-27T10:00:00Z"
}
```

---

## ⚠️ Error Handling

Standard format for 4xx/5xx errors:

```json
{
  "error": "Bad Request",
  "message": "Product 'prod_99' not found in this shop.",
  "code": "PRODUCT_NOT_FOUND" // Optional machine-readable code
}
```

| Code | Meaning |
| :--- | :--- |
| `400` | Validation Error (Zod). |
| `404` | Shop context not found or Product not found. |
| `409` | Conflict (e.g., Product is out of stock). |
| `500` | Internal Server Error. |
