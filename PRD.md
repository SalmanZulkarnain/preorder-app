# Product Requirement Document (PRD)

## 1. Document Information
- Project Name: Preorder Food Management System
- Version: 1.0
- Status: MVP / Active Development
- Repository: preorder-app

## 2. Background
This project is a web-based preorder platform for food businesses. It is designed to help business owners manage products, receive customer orders, process payments, and monitor transaction activity through a simple admin dashboard.

The system combines a public storefront experience for customers and an admin panel for business operations.

## 3. Product Objectives
The main goals of this product are to:
- allow customers to browse food products online
- enable customers to add items to cart and place an order
- support online payment integration
- provide admin users with product and transaction management tools
- create a portfolio-grade full-stack application using modern web technologies

## 4. Target Users
### 4.1 Customer / Buyer
Customers use the application to:
- view available food products
- add products to cart
- complete checkout
- pay for orders
- track or search transaction status

### 4.2 Admin / Business Owner
Admin users use the application to:
- log in securely
- manage product catalog
- add, edit, and delete products
- view sales and transaction summaries
- monitor payment status
- export product and transaction data

### 4.3 Marketing / Subscriber
Users can also subscribe using a phone number to receive menu or promo updates.

## 5. Core Features Already Implemented

### 5.1 Public Landing Page
A public landing page is available with:
- hero/banner section
- feature highlights
- popular products
- tutorial/how-it-works
- testimonials
- subscription form

### 5.2 Product Catalog
Customers can view products from the product listing page. Product data includes:
- name
- description
- image
- price

### 5.3 Cart Management
Users can:
- add products to cart
- update quantity
- remove items from cart

### 5.4 Checkout and Order Creation
The system allows customers to submit checkout details and create an order based on the current cart contents.

### 5.5 Payment Integration
The application integrates with Midtrans for online payment processing. It supports:
- transaction creation
- payment status updates
- redirect/payment token flow

### 5.6 Invoice / Transaction Lookup
Users can search for transaction details using a transaction ID and view recent transaction history.

### 5.7 Admin Dashboard
Admins can access a dashboard that displays:
- revenue overview
- customer summary
- order summary
- product count
- recent transactions

### 5.8 Product CRUD
Admins can:
- view all products
- add a new product
- edit product details
- delete products
- upload product images

### 5.9 Transaction Management
Admins can:
- view transaction/payment history
- apply filters
- export payment data
- inspect payment details and order details

### 5.10 WhatsApp Subscriber Form
The landing page includes a subscription form that collects phone numbers for future communication.

## 6. User Flow

### 6.1 Customer Flow
1. Customer opens the landing page.
2. Customer browses products.
3. Customer adds products to cart.
4. Customer proceeds to cart and checkout.
5. Customer fills in customer identity data.
6. System creates an order.
7. Customer is redirected to payment or payment token flow.
8. Customer can check the transaction via invoice page.

### 6.2 Admin Flow
1. Admin logs in.
2. Admin is redirected to the admin dashboard.
3. Admin can manage products from the product page.
4. Admin can monitor transactions and payment statuses.
5. Admin can export transaction/product reports.

## 7. Current Implementation Notes
Several features are already working, but some areas are still partial or need refinement:
- logout flow is not fully polished
- discount management is implemented at API level but UI support is still limited
- WhatsApp subscriber management is basic and could be expanded
- some helper functions and routes may require cleanup or further validation

## 8. Success Criteria
The product is considered successful if:
- customers can complete the preorder flow smoothly
- admins can manage products and transactions effectively
- payments can be processed and tracked reliably
- the dashboard provides useful business insights