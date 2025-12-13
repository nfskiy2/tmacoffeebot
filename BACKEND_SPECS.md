
# API Contract (Backend Specifications)

> **Status:** Draft
> **Version:** 1.5.0
> **Auth:** No auth for guest (public), Bearer Token for Admin.
> **Multi-tenancy:** All requests MUST include `X-Shop-Id` header.

## Global Headers

| Header | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `X-Shop-Id` | UUID (string) | **YES** | Identifies the tenant (coffee shop). |
| `Content-Type` | string | YES | `application/json` |

---

## 1. Shop Configuration

### Get Current Shop Details
Get public details about the specific coffee shop identified by `X-Shop-Id`.

**GET** `/api/v1/shop`

**Response (200 OK):**
```json
{
  "id": "uuid-string",
  "name": "Coffee & Code",
  "description": "(Central Branch)",
  "address": "123 Main St",
  "logoUrl": "https://picsum.photos/200",
  "bannerUrl": "https://picsum.photos/800/400",
  "currency": "USD",
  "themeColor": "#16a34a",
  "isClosed": false,
  "openingHours": "Mon - Sun: 08:00 - 23:00"
}
```

### Get Available Shops
List all available coffee shop locations for the tenant selection screen.

**GET** `/api/v1/shops`

**Response (200 OK):**
```json
[
  {
    "id": "shop_1",
    "name": "Main Street 50",
    "description": "(Downtown)",
    "address": "Main Street 50",
    "logoUrl": "...",
    "isClosed": false
  },
  {
    "id": "shop_2",
    "name": "Riverside 10",
    "description": "(Riverside)",
    "address": "Riverside 10",
    "logoUrl": "...",
    "isClosed": true
  }
]
```

---

## 2. Menu & Products

### Get Categories
List of active categories for the scroll-spy navigation.

**GET** `/api/v1/categories`

**Response (200 OK):**
```json
[
  {
    "id": "cat_1",
    "name": "Coffee",
    "slug": "coffee",
    "iconUrl": "https://cdn-icons-png.flaticon.com/512/751/751621.png",
    "sortOrder": 0
  },
  {
    "id": "cat_2",
    "name": "Desserts",
    "slug": "desserts",
    "iconUrl": "https://cdn-icons-png.flaticon.com/512/3081/3081967.png",
    "sortOrder": 1
  }
]
```

### Get Products
List of products. Can be filtered by category or specific IDs.

**GET** `/api/v1/products`

**Query Params:**
- `categoryId` (optional): Filter by category ID.
- `ids` (optional): Comma-separated list of product IDs (e.g., `prod_1,prod_2`).
- `limit` (optional): Default 20.
- `offset` (optional): Default 0.

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "prod_1",
      "categoryId": "cat_1",
      "name": "Cappuccino",
      "description": "Double espresso with steamed milk foam",
      "price": 450,
      "imageUrl": "https://picsum.photos/400",
      "isAvailable": true,
      "addons": [
        { "id": "add_1", "name": "Coconut Milk", "price": 50 },
        { "id": "add_2", "name": "Syrup", "price": 30 }
      ]
    }
  ],
  "total": 100
}
```

### Get Product Details
Get a single product by ID.

**GET** `/api/v1/products/:id`

**Response (200 OK):**
```json
{
  "id": "prod_1",
  "categoryId": "cat_1",
  "name": "Cappuccino",
  "description": "Double espresso with steamed milk foam",
  "price": 450,
  "imageUrl": "https://picsum.photos/400",
  "isAvailable": true,
  "addons": [
    { "id": "add_1", "name": "Coconut Milk", "price": 50 }
  ]
}
```

---

## 3. Banners

### Get Banners
List of promotional banners for the carousel.

**GET** `/api/v1/banners`

**Response (200 OK):**
```json
[
  {
    "id": "ban_1",
    "title": "Бизнес-ланч",
    "description": "Каждый понедельник с 22:00 до 23:00",
    "imageUrl": "https://...",
    "actionUrl": "category://food"
  }
]
```

---

## 4. Orders

### Create Order
Submit a new order.

**POST** `/api/v1/orders`

**Request Body:**
```json
{
  "shopId": "uuid-string",
  "items": [
    {
      "productId": "prod_1",
      "quantity": 2,
      "selectedAddons": ["add_1"] 
    }
  ],
  "comment": "No sugar please"
}
```

**Response (201 Created):**
```json
{
  "id": "ord_123",
  "status": "PENDING",
  "totalAmount": 1100,
  "createdAt": "2023-10-27T10:00:00Z"
}
```