# Janu Collection E-commerce Backend

A robust Node.js/Express backend for the Janu Collection e-commerce platform with comprehensive features for product management, order processing, user authentication, and payment integration.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Password hashing with bcrypt

- **Product Management**
  - CRUD operations for products
  - Image upload and management
  - Category-based organization
  - Stock management

- **Order Processing**
  - Complete order lifecycle
  - Payment integration (Stripe)
  - Order status tracking
  - Transaction management

- **Payment System**
  - Multiple payment methods (Stripe, UPI, Bank Transfer)
  - QR code generation for UPI payments
  - Payment verification system
  - Dynamic payment settings

- **User Management**
  - Profile management
  - Order history
  - Address management
  - Password change functionality

- **Newsletter System**
  - Email subscription management
  - Subscriber analytics
  - Admin management interface

- **Security Features**
  - Rate limiting
  - Input validation
  - CORS configuration
  - Helmet security headers

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SagarikaVandana/janu-ecommerce-backend.git
   cd janu-ecommerce-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/janu-collections
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   
   # Email Configuration (SendGrid or Gmail)
   SENDGRID_API_KEY=your-sendgrid-api-key
   FROM_EMAIL=noreply@janucollections.com
   EMAIL_USER=your-gmail-address@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   
   # SMS Configuration (Twilio)
   TWILIO_ACCOUNT_SID=your-twilio-account-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   
   # Payment Configuration
   STRIPE_SECRET_KEY=your-stripe-secret-key
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB
   mongod
   
   # Seed the database (optional)
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── models/           # Database models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── PaymentSettings.js
├── routes/           # API routes
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   ├── admin.js
│   ├── users.js
│   ├── paymentSettings.js
│   └── newsletter.js
├── middleware/       # Custom middleware
│   └── auth.js
├── scripts/          # Database seeding
│   ├── seedAdmin.js
│   ├── seedProducts.js
│   └── seedOrders.js
├── server.js         # Main server file
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders/user-stats` - Get user statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Admin
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/orders` - All orders (Admin)
- `GET /api/admin/products` - All products (Admin)

### Payment Settings
- `GET /api/payment-settings` - Get payment settings
- `PUT /api/payment-settings` - Update payment settings (Admin)

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/newsletter/subscribers` - Get subscribers (Admin)

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm start            # Start production server

# Database
npm run seed         # Seed database with sample data

# Testing
npm test             # Run tests
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent abuse with express-rate-limit
- **Input Validation**: express-validator for data validation
- **CORS Configuration**: Secure cross-origin requests
- **Helmet**: Security headers for Express

## 📊 Database Models

### User Model
- Basic info (name, email, password)
- Address information
- Admin role support
- Timestamps

### Product Model
- Product details (name, description, price)
- Image management
- Category and stock
- Active status

### Order Model
- User reference
- Product items with quantities
- Shipping information
- Payment details
- Status tracking

### PaymentSettings Model
- Bank account details
- UPI configuration
- Payment method settings

## 🚀 Deployment

### Environment Variables
Make sure to set all required environment variables in production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
```

### Production Commands
```bash
npm install --production
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support, email: janucollectionvizag@gmail.com

## 🔗 Links

- **Frontend Repository**: [Janu Collection Frontend](https://github.com/SagarikaVandana/janu-ecommerce-frontend)
- **Live Demo**: [Janu Collection](https://janu-collection.vercel.app)
- **Documentation**: [API Documentation](https://janu-collection-api.herokuapp.com/docs)

---

**Built with ❤️ for Janu Collection** 