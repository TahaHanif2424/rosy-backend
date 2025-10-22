# Rosy Jewel Boutique Backend API
db password
HsSJIRWhUPcAK7uJ

Complete Node.js + Express + MongoDB backend for the jewelry e-commerce application.

## Features

- **Authentication**: JWT-based admin authentication
- **Admin Management**: Signup, login, and profile management
- **Product Management**: CRUD operations for jewelry products
- **Order Management**: Create and manage customer orders
- **Security**: Helmet, CORS, rate limiting
- **Validation**: Request validation using express-validator
- **TypeScript**: Fully typed codebase

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000

MONGODB_URI=mongodb://localhost:27017/rosy-jewel-boutique
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/signup` | Register new admin | Public |
| POST | `/login` | Admin login | Public |
| GET | `/profile` | Get admin profile | Private |

### Product Routes (`/api/products`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all products | Public |
| GET | `/:id` | Get product by ID | Public |
| POST | `/` | Create new product | Private (Admin) |
| PUT | `/:id` | Update product | Private (Admin) |
| DELETE | `/:id` | Delete product | Private (Admin) |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create new order | Public |
| GET | `/` | Get all orders with stats | Private (Admin) |
| GET | `/:id` | Get order by ID | Private (Admin) |
| PATCH | `/:id/status` | Update order status | Private (Admin) |
| DELETE | `/:id` | Delete order | Private (Admin) |

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Request Examples

### Admin Signup
```bash
POST /api/admin/signup
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

### Admin Login
```bash
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Create Product
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Diamond Ring",
  "category": "rings",
  "price": 299.99,
  "image": "https://example.com/image.jpg",
  "description": "Beautiful diamond ring"
}
```

### Create Order
```bash
POST /api/orders
Content-Type: application/json

{
  "items": [
    {
      "id": "1",
      "name": "Diamond Ring",
      "category": "rings",
      "price": 299.99,
      "image": "https://example.com/image.jpg",
      "description": "Beautiful diamond ring",
      "quantity": 1
    }
  ],
  "total": 299.99,
  "customerName": "John Doe",
  "email": "john@example.com",
  "contactNumber": "+1234567890"
}
```

### Get All Orders (Admin)
```bash
GET /api/orders
Authorization: Bearer <token>
```

Response includes:
- List of all orders
- Total sales
- Total profit (40% margin)
- Order count

## Database Models

### Admin
- name: string
- email: string (unique)
- password: string (hashed)
- timestamps

### Product
- name: string
- category: enum (necklaces, earrings, rings, bracelets)
- price: number
- image: string
- description: string
- timestamps

### Order
- items: array of cart items
- total: number
- customerName: string
- email: string
- contactNumber: string
- status: enum (pending, processing, completed, cancelled)
- timestamps

## Error Handling

All API responses follow this format:

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Security Features

- **Helmet**: Sets security-related HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive request validation

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # MongoDB connection
│   │   └── env.ts           # Environment configuration
│   ├── controllers/
│   │   ├── adminController.ts
│   │   ├── orderController.ts
│   │   └── productController.ts
│   ├── middleware/
│   │   ├── auth.ts          # JWT authentication
│   │   └── errorHandler.ts  # Error handling
│   ├── models/
│   │   ├── Admin.ts
│   │   ├── Order.ts
│   │   └── Product.ts
│   ├── routes/
│   │   ├── adminRoutes.ts
│   │   ├── orderRoutes.ts
│   │   └── productRoutes.ts
│   ├── utils/
│   │   └── jwt.ts           # JWT utilities
│   └── server.ts            # Entry point
├── .env.example
├── .gitignore
├── nodemon.json
├── package.json
├── tsconfig.json
└── README.md
```

## License

ISC
