# InstaShop Nepal - Full-Stack Marketplace Platform

A complete full-stack web application for an Instagram-based marketplace in Nepal, built with React, TypeScript, Vite, and Tailwind CSS.

## 🌟 Features

### 🔐 Authentication System
- User signup and login
- Three user roles: Customer, Shop Owner, Admin
- Secure session management using localStorage
- Password validation

### 🛍️ Customer Features
- Browse verified shops and products
- Search and filter shops by category and location
- View shop details and reviews
- Add products to cart
- Checkout with delivery information
- Cash on Delivery payment
- Track orders
- View order history
- Leave reviews and ratings for shops

### 🏪 Shop Owner Features
- Register shop with details (name, category, Instagram, PAN number)
- Add and manage products (name, price, image, description)
- Edit and delete products
- View and manage orders
- Track order status (Pending, Confirmed, Delivered, Cancelled)
- Shop dashboard with analytics
- View revenue and order statistics
- Receive customer messages

### ⚙️ Admin Features
- Admin dashboard with platform statistics
- Verify or reject shop submissions
- View shop details and PAN numbers
- Manage all users and shops
- View all orders
- Platform analytics

### 💬 Chat System
- Real-time messaging between customers and shop owners
- Admin can chat with users and shop owners
- Conversation history
- Timestamp for all messages

### ⭐ Reviews & Ratings
- Customers can rate shops (1-5 stars)
- Write detailed reviews
- View shop ratings and reviews
- Average rating calculation

### 🛒 Cart & Orders
- Add products to cart
- Manage cart quantities
- Calculate totals with tax and shipping
- Simple checkout process
- Order tracking
- Order history

### 🎨 UI/UX Features
- Clean, modern design with Tailwind CSS
- Responsive design (mobile-friendly)
- Gradient backgrounds and smooth transitions
- Product and shop cards
- Verified shop badges
- Status indicators for shops and orders

## 📁 Project Structure

```
market2/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ProductCard.tsx
│   ├── contexts/            # React Context for state management
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── BrowseShopsPage.tsx
│   │   ├── ShopDetailsPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── MessagesPage.tsx
│   │   ├── ShopRegistrationPage.tsx
│   │   ├── ShopDashboardPage.tsx
│   │   ├── ShopProductsPage.tsx
│   │   ├── ShopOrdersPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   ├── AdminShopsPage.tsx
│   │   └── AdminUsersPage.tsx
│   ├── utils/              # Database utilities
│   │   └── database.ts
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind CSS
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔄 Data Storage

The application uses **localStorage** for data persistence. This simulates a database without requiring a backend server. All data is stored in the browser's localStorage with the key `instashop_db`.

### Database Tables:
- **users** - User accounts
- **shops** - Shop information
- **products** - Product listings
- **orders** - Customer orders
- **messages** - Chat messages
- **reviews** - Shop ratings and reviews

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173/`

### Demo Credentials

**Customer Account:**
- Email: `john@example.com`
- Password: `user123`

**Shop Owner Account:**
- Email: `ravi@instashop.np`
- Password: `shop123`

**Admin Account:**
- Email: `admin@instashop.np`
- Password: `admin123`

## 🔑 Key Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/signup` - Sign up page
- `/shops` - Browse all shops
- `/shop/:shopId` - Shop details page

### Customer Routes (Protected)
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders` - My orders
- `/messages` - Messages

### Shop Owner Routes (Protected)
- `/shop-register` - Register new shop
- `/shop-dashboard` - Shop dashboard
- `/shop-products` - Manage products
- `/shop-orders` - Manage orders
- `/messages` - Messages

### Admin Routes (Protected)
- `/admin` - Admin dashboard
- `/admin/shops` - Verify shops
- `/admin/users` - Manage users
- `/messages` - Messages

## 💡 How It Works

### Authentication Flow
1. User signs up with name, email, password, and role
2. On login, credentials are verified against stored users
3. User ID is stored in localStorage for session management
4. ProtectedRoute component handles role-based access control

### Shopping Flow
1. Customer browses verified shops
2. Views shop details and products
3. Adds products to cart (stored in localStorage)
4. Proceeds to checkout
5. Enters delivery information
6. Places order (Cash on Delivery)
7. Order appears in Orders page

### Shop Management Flow
1. Shop owner registers shop with details and PAN
2. Shop is marked as pending verification
3. Admin reviews and approves/rejects
4. Once approved, shop becomes visible to customers
5. Shop owner can add and manage products
6. Can view and update order statuses

### Admin Verification Flow
1. Admin views pending shop submissions
2. Reviews shop details, Instagram, and PAN number
3. Can approve or reject shops
4. Verified shops become visible on marketplace
5. Admin manages users and monitors platform

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** React Context API
- **Data Storage:** Browser localStorage

## 📦 Dependencies

- `react` - UI framework
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `tailwindcss` - CSS framework
- `post` - CSS post-processor
- `autoprefixer` - CSS vendor prefixes

## 🔒 Security Notes

**Important:** This is a demo application. For production use:
- Never store passwords in plain text
- Implement proper backend authentication
- Use HTTPS for data transmission
- Implement proper password hashing (bcrypt, argon2)
- Add CSRF protection
- Implement rate limiting
- Use JWT or session-based authentication with secure tokens

## 🎯 Future Enhancements

- Real-time notifications
- Payment gateway integration
- Map-based shop location
- Advanced analytics
- Seller rating system
- Discount codes and coupons
- Wishlist feature
- Product inventory management
- Advanced search and filters
- Multi-language support

## 📄 License

This project is provided as-is for educational purposes.

## 🤝 Support

For questions or issues, please refer to the documentation or contact the development team.

---

**Built with ❤️ for supporting local Nepali businesses on Instagram**

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
