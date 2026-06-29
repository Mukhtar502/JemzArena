# JemzArena Backend

Professional food ordering platform API built with **NestJS 11**, **Prisma 7**, and **PostgreSQL**.

**Status:** MVP Phase 1 - Core Features Complete ✅

---

## Tech Stack

- **Runtime:** Node.js v25.2.1
- **Framework:** NestJS 11.0.1 (Express-based)
- **ORM:** Prisma 7.8.0
- **Database:** PostgreSQL (Docker for dev)
- **Authentication:** JWT + bcrypt
- **Validation:** class-validator + class-transformer

---

## Current Features

### ✅ Authentication Module

- User registration with password validation
- JWT-based login (24h expiry)
- Protected routes with JwtAuthGuard
- Get current user profile
- Logout endpoint

### ✅ Products Module

- Create products (admin)
- Read all products with filtering & pagination
- Filter by category, search by name/description
- Sort by price (asc/desc) or name
- Get featured products (first 8 available)
- Get all categories
- Get single product by ID
- Update product (admin)
- Delete product (admin)

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file in backend root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/jemz_arena"
JWT_SECRET="your-super-secret-key-change-this-in-production"
JWT_EXPIRATION="24h"
NODE_ENV="development"
```

### 3. Start PostgreSQL Docker Container

```bash
docker-compose up -d
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Seed the Database

```bash
npm run seed
```

### 6. Start Development Server

```bash
npm run start:dev
```

Server will be running on `http://localhost:3000`

---

## API Testing Guide (Postman)

### Step 1: Register New User

```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```

**Response:** User object with JWT token

```json
{
  "id": "...",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "access_token": "eyJhbGc..."
}
```

---

### Step 2: Copy JWT Token

Save the `access_token` from response. Use it for authenticated requests:

```
Authorization: Bearer eyJhbGc...
```

---

### Step 3: Create Products

```
POST http://localhost:3000/api/products
Content-Type: application/json
Authorization: Bearer {your-token}

{
  "name": "Meat Pie",
  "description": "Delicious homemade meat pie with tender beef",
  "price": "15.99",
  "image": "https://example.com/images/meat-pie.jpg",
  "category": "pastries",
  "available": true
}
```

Create more products:

```json
{
  "name": "Spring Roll",
  "description": "Crispy spring rolls with vegetables",
  "price": "8.50",
  "image": "https://example.com/images/spring-roll.jpg",
  "category": "rolls",
  "available": true
}
```

```json
{
  "name": "Samosa",
  "description": "Golden fried samosa with spices",
  "price": "5.99",
  "image": "https://example.com/images/samosa.jpg",
  "category": "pastries",
  "available": true
}
```

---

### Step 4: Get All Products

```
GET http://localhost:3000/api/products
```

**Response:**

```json
{
  "data": [
    {
      "id": "...",
      "name": "Meat Pie",
      "description": "...",
      "price": "15.99",
      "image": "...",
      "category": "pastries",
      "available": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### Step 5: Filter & Search Products

**Filter by Category:**

```
GET http://localhost:3000/api/products?category=pastries
```

**Search by Name:**

```
GET http://localhost:3000/api/products?search=meat
```

**Sort by Price (Ascending):**

```
GET http://localhost:3000/api/products?sort=price-asc
```

**Sort by Price (Descending):**

```
GET http://localhost:3000/api/products?sort=price-desc
```

**Sort by Name:**

```
GET http://localhost:3000/api/products?sort=name
```

**Pagination:**

```
GET http://localhost:3000/api/products?page=1&limit=5
```

**Combined Query:**

```
GET http://localhost:3000/api/products?category=pastries&search=pie&sort=price-desc&page=1&limit=10
```

**Swagger / OpenAPI:**

You can also test these filters directly in Swagger at:

```
http://localhost:3000/api/docs
```

Then open the Products section and try the GET /api/products endpoint with query parameters such as `category`, `search`, `sort`, `page`, and `limit`.

---

### Step 6: Get Categories

```
GET http://localhost:3000/api/products/categories
```

**Response:**

```json
[
  "pastries",
  "rolls",
  "samosa",
  ...
]
```

---

### Step 7: Get Featured Products

```
GET http://localhost:3000/api/products/featured
```

Returns first 8 available products.

---

### Step 8: Get Single Product

```
GET http://localhost:3000/api/products/{product-id}
```

Replace `{product-id}` with actual product ID from previous responses.

---

### Step 9: Update Product

```
PUT http://localhost:3000/api/products/{product-id}
Content-Type: application/json
Authorization: Bearer {your-token}

{
  "price": "16.99",
  "available": false
}
```

Only provide fields you want to update (partial update).

---

### Step 10: Delete Product

```
DELETE http://localhost:3000/api/products/{product-id}
Authorization: Bearer {your-token}
```

---

## Cart Endpoints

### Get Cart

```
GET http://localhost:3000/api/cart
Authorization: Bearer {your-token}
```

### Add Item to Cart

```
POST http://localhost:3000/api/cart
Content-Type: application/json
Authorization: Bearer {your-token}

{
  "productId": "{product-id}",
  "quantity": 2
}
```

### Update Cart Item Quantity

```
PUT http://localhost:3000/api/cart/{item-id}
Content-Type: application/json
Authorization: Bearer {your-token}

{
  "quantity": 3
}
```

### Remove Item from Cart

```
DELETE http://localhost:3000/api/cart/{item-id}
Authorization: Bearer {your-token}
```

### Clear Cart

```
DELETE http://localhost:3000/api/cart
Authorization: Bearer {your-token}
```

---

## API Documentation

The backend exposes Swagger/OpenAPI documentation at:

```
http://localhost:3000/api/docs
```

Use this page to explore the available endpoints, request bodies, and authentication requirements.

---

## Order & Checkout Endpoints

### Checkout

```
POST http://localhost:3000/api/orders/checkout
Content-Type: application/json
Authorization: Bearer {your-token}

{
  "deliveryAddress": "123 Market Street, Springfield",
  "specialInstructions": "Leave at the front desk"
}
```

### Get User Orders

```
GET http://localhost:3000/api/orders
Authorization: Bearer {your-token}
```

### Get Order Details

```
GET http://localhost:3000/api/orders/{order-id}
Authorization: Bearer {your-token}
```

---

## Auth Endpoints

### Login

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Get Current User

```
GET http://localhost:3000/api/auth/me
Authorization: Bearer {your-token}
```

### Logout

```
POST http://localhost:3000/api/auth/logout
Authorization: Bearer {your-token}
```

---

## Project Structure

```
src/
├── main.ts                          # App entry point
├── app.module.ts                    # Root module
├── database/
│   ├── database.module.ts           # Database setup
│   └── prisma.service.ts            # Prisma wrapper
├── modules/
│   ├── auth/                        # Authentication
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── products/                    # Products
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.module.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       ├── update-product.dto.ts
│   │       └── filter-products.dto.ts
│   └── ...
├── utils/
│   └── bcrypt.util.ts               # Password hashing
└── config/
    └── jwt.config.ts                # JWT config
```

---

## Database Schema

### Users

- `id`: String (UUID)
- `email`: String (unique)
- `password`: String (hashed)
- `firstName`: String
- `lastName`: String
- `phone`: String
- `role`: String (default: "user")
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Products

- `id`: String (UUID)
- `name`: String
- `description`: String
- `price`: Decimal(10,2) - prevents float rounding errors
- `image`: String (URL)
- `category`: String
- `available`: Boolean (default: true)
- `createdAt`: DateTime
- `updatedAt`: DateTime

---

## Roadmap

### Phase 2: Cart & Checkout

- [x] Shopping cart management
- [x] Checkout endpoint with email/WhatsApp notifications
- [ ] Order tracking

### Phase 3: Admin Dashboard

- [ ] Order management
- [ ] Sales analytics
- [ ] Inventory management

### Phase 4: Production Ready

- [ ] Supabase migration
- [ ] Docker deployment
- [ ] API documentation (Swagger)
- [ ] Rate limiting & security

---

## Environment Variables

| Variable         | Description                  | Example                                            |
| ---------------- | ---------------------------- | -------------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string | `postgresql://user:pass@localhost:5435/jemz_arena` |
| `JWT_SECRET`     | Secret key for JWT signing   | `your-secret-key`                                  |
| `JWT_EXPIRATION` | Token expiry time            | `24h`                                              |
| `NODE_ENV`       | Environment                  | `development`                                      |

---

## Performance Notes

- **Prices stored as Decimal(10,2):** Prevents floating-point rounding errors (0.1 + 0.2 = 0.3)
- **Pagination:** Default 10 items per page, max configurable
- **Database indexes:** Created on email, category, createdAt for fast queries
- **JWT validation:** 24-hour expiry, can be extended in jwt.config.ts

---

## Common Issues & Solutions

**Port 3000 already in use:**

```bash
# Change in main.ts:
await app.listen(3001); // Use different port
```

**Database connection refused:**

- Ensure Docker container is running: `docker ps`
- Check DATABASE_URL in .env
- Verify PostgreSQL credentials

**JWT token invalid:**

- Token expires after 24h, register/login again
- Ensure `Authorization: Bearer {token}` format in headers

---

## Collaboration

- Review the root `README.md` for overall project setup and Git workflow.
- Commit backend changes separately with clear messages like `feat(api): add product filtering`.
- Keep secrets out of Git by using `backend/.env` and `backend/.env.example`.
- If you add frontend integration, update the root README with frontend setup steps.

---

## License

MIT
