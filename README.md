# **Online Computer Store**







## **Overview**





**Online Computer Store** is a full-stack web application designed to simulate an **E-commerce platform** specializing in computers and related accessories. It provides separate functionalities for **users** and **administrators**, including **shopping**, **stock tracking**, and **order management**.



The system is built using **React.js** for the front-end, **Express.js** for the back-end, and **MySQL** for persistent data storage. It implements **JWT-based authentication**, **role-based authorization**, and responsive UI design for seamless use across devices.



------





## **Features**







### **User Functions**





- **Secure Login & Registration** — JWT authentication with bcrypt password hashing.
- **Profile Management** — View and update personal information.
- **Product Browsing** — Search and filter products, view detailed specifications.
- **Shopping Cart** — Add, remove, and update items; cart state synchronized across pages.
- **Simulated Checkout** — Stock validation, purchase confirmation, and email receipt.
- **Order History** — Review previous purchases.







### **Admin Functions**





- **Order Management** — View and delete all user orders.
- **Stock Tracking** — Monitor and edit product stock; zero-stock items removed from all carts.
- **Product Management** — View and filter products; adjust inventory levels.





------





## **Stock Tracking System**





- **Real-Time Stock Display** — Users see available quantities for each product.
- **Purchase Limits** — Prevents buying quantities exceeding stock.
- **Auto-Cart Updates** — Zero-stock items are automatically removed from carts.
- **Admin Controls** — Modify stock directly from the admin dashboard.





------





## **Technology Stack**





**Frontend:**



- React.js (v18.3.1)
- Material UI
- Context API for global state management





**Backend:**



- Express.js (v4.21.1)
- JWT Authentication & Role-based Authorization
- bcrypt password hashing





**Database:**



- MySQL





**Additional Tools & Services:**



- ZeroTier (development network)
- Postman (API testing)
- Mock API (frontend simulation)
- Tencent Mail SMTP (email service)
- Railway & Vercel (deployment)





------





## **API Endpoints**



| **Method** | **Endpoint**     | **Description**                |
| ---------- | ---------------- | ------------------------------ |
| POST       | /login           | Login as user or admin         |
| POST       | /register        | Register a new user            |
| GET        | /item/list       | Get all products               |
| GET        | /item/details    | Get product details            |
| GET        | /user/info       | Get user profile               |
| PUT        | /user/info       | Update user profile            |
| GET        | /cart/list       | Get cart contents              |
| PUT        | /cart/list       | Update cart contents           |
| POST       | /cart/validation | Validate stock before checkout |
| POST       | /checkout        | Complete simulated checkout    |
| GET        | /order/list      | Get user’s order history       |
| GET        | /order/details   | Get order details              |
| GET        | /user/list       | Get all users (admin)          |
| DELETE     | /item/info       | Delete a product (admin)       |
| GET        | /order/fullist   | Get all orders (admin)         |
| PUT        | /item/stock      | Update product stock (admin)   |
| DELETE     | /order/info      | Delete an order (admin)        |



------





## **Security & Authorization**





- **JWT Tokens** — Generated on login; store role info (0 for user, 1 for admin).
- **Role-Based Access** — Middleware checks permissions before granting access.
- **Password Security** — bcrypt hashing with salt before storage.





------





## **Implementation Highlights**





- **Optimized Image Transmission** — Compressed base64 icons for list views; full-size images for detail pages.
- **Efficient Cart Sync** — Context API for global state; backend sync only on close, navigation, or checkout.
- **Responsive Design** — Flexbox and media queries ensure mobile/tablet/laptop compatibility.
- **Parallel Development** — Mock APIs allowed independent front-end and back-end progress.





------





## **Installation & Running**





1. Clone this repository:



```
git clone https://github.com/username/online-computer-store.git
```



1. 
2. Install dependencies:



```
cd frontend && npm install
cd ../backend && npm install
```



1. 
2. Configure .env files for backend (database, JWT secret, SMTP settings).
3. Start development servers:



```
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start
```





------





## **Future Enhancements**





- **Email-based Login & Password Reset** — Verification codes with expiration.
- **Admin Product Upload** — Add new products with specifications and images.





------









## **License**





This project is released under the [MIT License](LICENSE).
