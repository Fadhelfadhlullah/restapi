# REST API Specification

## Overview
REST API untuk mengelola koleksi item dengan operasi CRUD dasar. API ini menggunakan format JSON untuk request dan response.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Saat ini tidak menggunakan authentication (akan ditambahkan di fase selanjutnya).

## Content Type
- Request: `application/json`
- Response: `application/json`

## Endpoints

### 1. Get All Items
**Endpoint:** `GET /api/items`

**Description:** Mengambil semua item dari koleksi

**Request:**
- Method: GET
- Headers: None required
- Body: None

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Item Name",
      "description": "Item description",
      "price": 100000,
      "category": "electronics",
      "stock": 10,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Status Codes:**
- 200: Success
- 500: Internal Server Error

### 2. Get Item by ID
**Endpoint:** `GET /api/items/:id`

**Description:** Mengambil satu item berdasarkan ID

**Parameters:**
- `id` (path parameter): Integer - ID dari item yang ingin diambil

**Request:**
- Method: GET
- Headers: None required
- Body: None

**Response Success:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Item Name",
    "description": "Item description",
    "price": 100000,
    "category": "electronics",
    "stock": 10,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Not Found:**
```json
{
  "success": false,
  "error": "Item not found",
  "message": "Item with ID 999 not found"
}
```

**Status Codes:**
- 200: Success
- 404: Item not found
- 400: Invalid ID format
- 500: Internal Server Error

### 3. Create New Item (Future Implementation)
**Endpoint:** `POST /api/items`

**Description:** Membuat item baru

**Request:**
```json
{
  "name": "New Item",
  "description": "Item description",
  "price": 150000,
  "category": "electronics",
  "stock": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "New Item",
    "description": "Item description",
    "price": 150000,
    "category": "electronics",
    "stock": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Item created successfully"
}
```

### 4. Update Item (Future Implementation)
**Endpoint:** `PUT /api/items/:id`

**Description:** Mengupdate item berdasarkan ID

### 5. Delete Item (Future Implementation)
**Endpoint:** `DELETE /api/items/:id`

**Description:** Menghapus item berdasarkan ID

## Data Model

### Item Object
```json
{
  "id": "integer (auto-increment)",
  "name": "string (required, max 100 chars)",
  "description": "string (optional, max 500 chars)",
  "price": "number (required, positive)",
  "category": "string (required)",
  "stock": "integer (required, non-negative)",
  "createdAt": "ISO 8601 datetime string",
  "updatedAt": "ISO 8601 datetime string"
}
```

## Error Response Format
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message",
  "statusCode": 400
}
```

## Status Codes Summary
- 200: OK - Request successful
- 201: Created - Resource created successfully
- 400: Bad Request - Invalid request data
- 404: Not Found - Resource not found
- 500: Internal Server Error - Server error

## Sample Data
Untuk fase development, akan menggunakan data mock berikut:

```json
[
  {
    "id": 1,
    "name": "Laptop Gaming",
    "description": "High-performance gaming laptop with RTX graphics",
    "price": 15000000,
    "category": "electronics",
    "stock": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with RGB lighting",
    "price": 250000,
    "category": "accessories",
    "stock": 20,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 3,
    "name": "Mechanical Keyboard",
    "description": "RGB mechanical keyboard with blue switches",
    "price": 800000,
    "category": "accessories",
    "stock": 15,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Implementation Notes
1. Fase 1: Implementasi GET endpoints dengan data JSON mock
2. Fase 2: Tambahkan POST, PUT, DELETE endpoints
3. Fase 3: Integrasi dengan database
4. Fase 4: Tambahkan authentication dan authorization
5. Fase 5: Tambahkan validation dan error handling yang lebih robust
