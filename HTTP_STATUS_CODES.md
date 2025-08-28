# HTTP Status Codes Reference

## Status Codes yang Digunakan dalam API

### 2xx Success
- **200 OK** - Request berhasil
  - GET /api/items (retrieve items)
  - GET /api/items/:id (retrieve single item)
  - PATCH /api/items/:id (update item)
  - DELETE /api/items/:id (delete item)
  - GET /health (health check)

- **201 Created** - Resource berhasil dibuat
  - POST /api/items (create new item)

### 4xx Client Error
- **400 Bad Request** - Request tidak valid
  - Invalid JSON format
  - Missing required fields
  - Invalid data types
  - Validation errors

- **404 Not Found** - Resource tidak ditemukan
  - GET /api/items/:id (item not found)
  - PATCH /api/items/:id (item not found)
  - DELETE /api/items/:id (item not found)
  - Any undefined routes

- **409 Conflict** - Konflik dengan state resource
  - POST /api/items (duplicate name)
  - PATCH /api/items/:id (duplicate name)
  - DELETE /api/items/:id (foreign key constraint)

- **422 Unprocessable Entity** - Request valid tapi tidak bisa diproses
  - Business logic validation errors

### 5xx Server Error
- **500 Internal Server Error** - Error pada server
  - Database connection errors
  - Unexpected application errors
  - System failures

## Implementasi Status Codes

### GET /api/items
```
200 OK - Items retrieved successfully
500 Internal Server Error - Database error
```

### GET /api/items/:id
```
200 OK - Item found and returned
400 Bad Request - Invalid ID format
404 Not Found - Item not found
500 Internal Server Error - Database error
```

### POST /api/items
```
201 Created - Item created successfully
400 Bad Request - Validation errors
409 Conflict - Duplicate item name
500 Internal Server Error - Database error
```

### PATCH /api/items/:id
```
200 OK - Item updated successfully
400 Bad Request - Invalid ID or validation errors
404 Not Found - Item not found
409 Conflict - Duplicate item name
500 Internal Server Error - Database error
```

### DELETE /api/items/:id
```
200 OK - Item deleted successfully
400 Bad Request - Invalid ID format
404 Not Found - Item not found
409 Conflict - Foreign key constraint
500 Internal Server Error - Database error
```

## Error Response Format

Semua error response menggunakan format yang konsisten:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human readable error message",
  "statusCode": 400,
  "details": [
    {
      "field": "field_name",
      "message": "Field specific error message"
    }
  ]
}
```

## Success Response Format

Semua success response menggunakan format yang konsisten:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 100,
    "limit": 20,
    "offset": 0,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Best Practices

1. **Konsistensi** - Gunakan status code yang sama untuk situasi yang sama
2. **Semantik** - Status code harus mencerminkan hasil operasi
3. **Error Handling** - Berikan informasi error yang berguna
4. **Documentation** - Dokumentasikan semua kemungkinan status code
5. **Testing** - Test semua status code scenarios
