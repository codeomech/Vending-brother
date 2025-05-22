# 🍿 Wendor Vending Machine

A modern, full-stack vending machine application built with Next.js, TypeScript, Node.js, and MongoDB. Features a sleek user interface with real-time inventory management and secure payment processing.

![Vending Machine Demo](https://img.shields.io/badge/Status-Active-green) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

## 🚀 Live Demo

[**View Live Application**](https://vending-brother.vercel.app/) | [**API Documentation**](https://documenter.getpostman.com/view/23293706/2sB2qaiMMg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🛒 **Customer Features**
- **Product Browsing**: View all available items with images, prices, and stock levels
- **Smart Cart System**: Blinkit-style popup cart with real-time updates
- **Quantity Management**: Add/remove items with stock validation
- **Secure Checkout**: One-click purchase with payment processing
- **Success Confirmation**: Beautiful success page with auto-redirect
- **Responsive Design**: Seamless experience across all devices

### 👨‍💼 **Admin Features** Backend Only for this
- **Inventory Management**: Add, update, and delete products
- **Bulk Operations**: Create multiple items at once
- **Stock Monitoring**: Real-time inventory tracking
- **Secure Authentication**: JWT-based admin authentication

### 🔧 **Technical Features**
- **Real-time Updates**: Instant inventory synchronization
- **Persistent Cart**: Cart state preserved across sessions
- **Error Handling**: Comprehensive error management
- **Loading States**: Smooth UX with loading indicators
- **Type Safety**: Full TypeScript implementation

## 🛠 Tech Stack

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: React Context API
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image Component

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing
- **Validation**: Express middleware

### **Development Tools**
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier (recommended)
- **Version Control**: Git

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • Product List  │    │ • REST API      │    │ • Users         │
│ • Shopping Cart │    │ • Auth System   │    │ • Inventory     │
│ • Checkout      │    │ • Inventory     │    │ • Transactions  │
│ • Admin Panel   │    │ • Validation    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Git



## 🎯 Usage

### Starting the Application
1. **Backend**: `cd vending-machine-api && npm run dev` (Port 5000)
2. **Frontend**: `cd vending-machine-ui && npm run dev` (Port 3000)
3. **Access**: Open [http://localhost:3000](http://localhost:3000)

### Initial Setup
1. **Create Admin Account**: 
   ```bash
   POST http://localhost:5000/api/auth/register
   {
     "username": "admin",
     "password": "your-secure-password"
   }
   ```

2. **Add Initial Inventory**:
   ```bash
   POST http://localhost:5000/api/inventory/bulk
   Authorization: Bearer YOUR_JWT_TOKEN
   {
     "items": [
       {
         "name": "Coca Cola",
         "price": 2.50,
         "available_units": 20,
         "display_image_url": "https://example.com/coca-cola.jpg"
       }
     ]
   }
   ```

### Customer Workflow
1. 🛍️ **Browse Products** - View available items on homepage
2. ➕ **Add to Cart** - Select quantities and add items
3. 👀 **Review Cart** - Check items in the popup or cart page
4. 💳 **Checkout** - Complete purchase with one click
5. ✅ **Success** - View confirmation and return to shopping

## 📚 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register    # Create admin account
POST /api/auth/login       # Admin login
```

### Public Endpoints
```http
GET  /api/inventory        # Get all available products
POST /api/inventory/buy    # Purchase items
```

### Admin Endpoints (Protected)
```http
POST /api/inventory/bulk   # Create multiple products
PUT  /api/inventory/:id    # Update product
```

### Sample API Requests

#### Get Products
```bash
curl -X GET http://localhost:5000/api/inventory
```

#### Purchase Items
```bash
curl -X POST http://localhost:5000/api/inventory/buy \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"id": "product_id", "quantity": 2}
    ]
  }'
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 🐛 Known Issues & Roadmap

### Current Issues
- [ ] Real-time inventory updates across multiple sessions
- [ ] Payment gateway integration

### Upcoming Features
- [ ] 🔔 Push notifications for low stock
- [ ] 📊 UI for Admin Portal
- [ ] 🛡️ Enhanced security measures
- [ ] 💳 Payment integration
- [ ] 🏷️ Product categories and filtering
- [ ] ⭐ Customer reviews and ratings
- [ ] 📧 Email notifications for purchases

## 🙏 Acknowledgments

- **Shadcn/UI** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Next.js** team for the amazing React framework
- **MongoDB** for the flexible document database
- **Wendor** for the opportunity to build this application

## 📞 Support

For support, email harshitmangla16@gmail.com or create an issue in the GitHub repository.

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by Harshit Mangla(https://github.com/codeomech)

</div>
