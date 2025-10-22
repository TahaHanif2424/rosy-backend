# Authentication Architecture

## Overview

This application implements a **dual-access model**:
- **Public Access**: For customers to browse and order
- **Admin Access**: For store management (requires JWT authentication)

## Public Access (No Authentication Required)

### What Customers Can Do WITHOUT Login:

1. **Browse Products**
   - `GET /api/products` - View all jewelry products
   - `GET /api/products/:id` - View individual product details
   - Filter by category (necklaces, earrings, rings, bracelets)

2. **Place Orders**
   - `POST /api/orders` - Create order by providing:
     - Customer name
     - Email address
     - Contact number
     - Items in cart
     - Total amount
   - No registration or login required
   - Simple checkout process

### Customer Workflow:
```
1. Browse products → 2. Add to cart → 3. Fill checkout form → 4. Order placed ✓
```

No account creation, no passwords, no JWT tokens needed!

---

## Admin Access (JWT Authentication Required)

### Admin-Only Features:

1. **Admin Management**
   - `POST /api/admin/signup` - Register admin account (one-time)
   - `POST /api/admin/login` - Login and receive JWT token
   - `GET /api/admin/profile` - View admin profile

2. **Product Management** (Protected)
   - `POST /api/products` - Add new products
   - `PUT /api/products/:id` - Update existing products
   - `DELETE /api/products/:id` - Remove products

3. **Order Management** (Protected)
   - `GET /api/orders` - View all orders + statistics
   - `GET /api/orders/:id` - View specific order
   - `PATCH /api/orders/:id/status` - Update order status
   - `DELETE /api/orders/:id` - Delete order

### Admin Workflow:
```
1. Signup/Login → 2. Receive JWT token → 3. Use token in headers → 4. Access admin features
```

### Using JWT Token:
```bash
# Example: Get all orders (admin only)
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Security Implementation

### Authentication Middleware
The `authenticate` middleware in `src/middleware/auth.ts`:
- Checks for `Authorization: Bearer <token>` header
- Validates JWT token
- Extracts admin ID and email
- Only applied to admin routes

### Route Protection Summary

| Endpoint | Authentication | Who Can Access |
|----------|---------------|----------------|
| GET /api/products | ❌ None | Everyone |
| GET /api/products/:id | ❌ None | Everyone |
| POST /api/orders | ❌ None | Everyone (Customers) |
| POST /api/admin/signup | ❌ None | Anyone (first-time setup) |
| POST /api/admin/login | ❌ None | Registered admins |
| POST /api/products | ✅ JWT | Admin only |
| PUT /api/products/:id | ✅ JWT | Admin only |
| DELETE /api/products/:id | ✅ JWT | Admin only |
| GET /api/orders | ✅ JWT | Admin only |
| GET /api/orders/:id | ✅ JWT | Admin only |
| PATCH /api/orders/:id/status | ✅ JWT | Admin only |
| DELETE /api/orders/:id | ✅ JWT | Admin only |

---

## Why This Architecture?

### Benefits for Customers:
✅ **Friction-free shopping** - No account creation required
✅ **Quick checkout** - Just fill name, email, phone
✅ **Privacy** - No password storage for customers
✅ **Better conversion** - Fewer barriers to purchase

### Benefits for Admin:
✅ **Secure management** - JWT protects admin functions
✅ **Full control** - Manage products and orders
✅ **Analytics** - View sales, profit, order statistics
✅ **Order tracking** - Monitor all customer orders

---

## Example Usage

### Customer Orders Product (No Auth):
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "id": "1",
        "name": "Diamond Ring",
        "category": "rings",
        "price": 299.99,
        "image": "https://example.com/ring.jpg",
        "description": "Beautiful diamond ring",
        "quantity": 1
      }
    ],
    "total": 299.99,
    "customerName": "Jane Smith",
    "email": "jane@example.com",
    "contactNumber": "+1234567890"
  }'
```

### Admin Adds Product (Requires Auth):
```bash
# First, login to get token
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Use the token from response
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "name": "Gold Necklace",
    "category": "necklaces",
    "price": 499.99,
    "image": "https://example.com/necklace.jpg",
    "description": "Elegant gold necklace"
  }'
```

---

## Summary

**This is a B2C (Business-to-Consumer) e-commerce model:**
- **Customers**: Browse and buy without barriers
- **Admin**: Full management with secure authentication
- **Best of both worlds**: Easy shopping + Secure management
