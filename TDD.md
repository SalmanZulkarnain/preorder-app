# Technical Design Document (TDD)

## 1. Document Information
- Project Name: Preorder Food Management System
- Version: 1.0
- Status: MVP / Active Development

## 2. Overview
This project is a full-stack web application built with Next.js and TypeScript. It uses server-side route handlers for business logic, Prisma as the ORM, and PostgreSQL as the primary database.

The application is structured around two main experiences:
- customer-facing preorder flow
- admin dashboard and management panel

## 3. Tech Stack

### 3.1 Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI primitives
- Lucide React icons
- Sonner for toast notifications
- React Hook Form
- Zod for validation

### 3.2 Backend
- Next.js App Router
- Route Handlers under the app/api directory
- Server-side rendering and server actions style logic

### 3.3 Database
- PostgreSQL
- Prisma ORM

### 3.4 Authentication & Security
- bcrypt for password hashing
- cookie-based session using HttpOnly cookies
- middleware-based route protection for /admin routes

### 3.5 File Storage / Media
- Vercel Blob for image upload in production
- local uploads folder in development

### 3.6 Third-Party Services
- Midtrans for payment gateway integration
- optional WhatsApp subscriber flow via API endpoint

## 4. Architecture Overview
The application follows a layered structure:

1. Client layer
   - pages and UI components
   - cart and checkout interfaces
   - admin dashboard

2. API layer
   - route handlers in app/api
   - request validation and business logic

3. Data layer
   - Prisma ORM
   - PostgreSQL database

4. External services
   - Midtrans for payment
   - Vercel Blob for image storage

## 5. Database Schema

### 5.1 Product
Represents products available for preorder.

Fields:
- id
- name
- image
- description
- price
- discountPercent
- discountPrice
- discountStart
- discountEnd
- isDiscountActive
- createdAt
- updatedAt

Relationships:
- one product can appear in many carts
- one product can appear in many order items

### 5.2 Cart
Represents temporary items in a customer cart.

Fields:
- id
- sessionId
- productId
- quantity
- createdAt
- updatedAt

Relationships:
- belongs to one product

### 5.3 Customer
Represents a person who places an order.

Fields:
- id
- name
- phoneNumber
- createdAt
- updatedAt

Relationships:
- one customer can have many orders

### 5.4 Order
Represents a completed checkout transaction.

Fields:
- id
- customerId
- transactionId
- customerName
- totalAmount
- status
- token
- redirectUrl
- createdAt
- updatedAt

Relationships:
- belongs to one customer
- has many order items
- has many payments

### 5.5 OrderItem
Represents the product breakdown inside an order.

Fields:
- id
- productId
- orderId
- quantity
- priceAtOrder
- originalPrice
- discountApplied
- createdAt
- updatedAt

Relationships:
- belongs to one order
- belongs to one product

### 5.6 Payment
Represents payment events and Midtrans responses.

Fields:
- id
- transactionId
- midtransTransactionId
- paymentType
- bank
- vaNumber
- grossAmount
- transactionStatus
- fraudStatus
- transactionTime
- expiryTime
- rawResponse
- createdAt
- updatedAt

Relationships:
- belongs to one order

### 5.7 User
Represents admin accounts.

Fields:
- id
- name
- email
- password
- role
- createdAt
- updatedAt

### 5.8 WhatsappSubscriber
Represents a phone number subscribed for updates.

Fields:
- id
- phone
- createdAt

## 6. API Contract

### 6.1 Authentication
| Method | Path | Purpose |
|---|---|---|
| POST | /api/login | Authenticate admin user |
| POST | /api/logout | End logout flow |
| GET | /api/me | Get current login user info |

### 6.2 Products
| Method | Path | Purpose |
|---|---|---|
| GET | /api/product | Get all products with pagination/filter support |
| POST | /api/product | Create a new product |
| GET | /api/product/[id] | Get one product by ID |
| PUT | /api/product/[id] | Update product |
| DELETE | /api/product/[id] | Delete product |
| PATCH | /api/product/[id] | Update discount-related product data |
| GET | /api/product/export | Export product data to CSV |

### 6.3 Cart
| Method | Path | Purpose |
|---|---|---|
| GET | /api/cart | Get current cart items |
| POST | /api/cart | Add a product to cart |
| PATCH | /api/cart/[id] | Update quantity or remove cart item |
| DELETE | /api/cart/[id] | Delete cart item |

### 6.4 Orders and Payments
| Method | Path | Purpose |
|---|---|---|
| GET | /api/order | Get order list |
| POST | /api/order | Create a new order from cart |
| POST | /api/midtrans | Create Midtrans payment transaction |
| GET | /api/payment | Get payment history with filters and pagination |
| POST | /api/payment | Midtrans webhook handler |
| GET | /api/payment/export | Export payment data |

### 6.5 Invoices / Transaction Lookup
| Method | Path | Purpose |
|---|---|---|
| GET | /api/invoice | Get recent transactions from client cookie |
| POST | /api/invoice | Find transaction by transactionId |

### 6.6 Subscriber
| Method | Path | Purpose |
|---|---|---|
| GET | /api/whapi | Get subscribers |
| POST | /api/whapi | Register a new WhatsApp subscriber |

## 7. API Response Conventions
Most API routes return JSON in the form of:
- success: boolean
- message: string
- data: object or array
- pagination: optional pagination metadata

## 8. Authentication and Security Design
- Passwords are hashed using bcrypt before storing.
- Admin authentication uses cookie-based session storage.
- Admin routes are protected through middleware.
- Midtrans payment webhook requests are validated using signature verification.
- Server-side route handlers are used to protect business logic from direct client access.

## 9. Notes / Known Implementation Considerations
- There is a helper referring to /api/customer, but no corresponding route is currently implemented.
- Some modules are functional but may need further polishing for production readiness.
- Logout handling and permission granularity can be improved in future iterations.