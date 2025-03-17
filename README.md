# 🛒 Zofo - E-Commerce Platform

## 📌 About
**Zofo** is a large-scale e-commerce web application built using **Node.js, Express.js, and MongoDB**. It provides users with a seamless online shopping experience, including product browsing, order management, secure authentication, and payment processing. 

## ✨ Features
- 🔐 **User Authentication**: Secure registration and login with JWT authentication.
- 🏷️ **Product Management**: CRUD operations for products, categories, and subcategories.
- 🛍️ **Shopping Cart & Checkout**: Add products to the cart and process payments.
- 📦 **Order Tracking**: Manage orders and track purchase history.
- 🖼️ **Image Storage**: Cloudinary integration for product images.
- 🔍 **Advanced Search & Filters**: Find products efficiently.
- ✅ **Error Handling & Validation**: Ensuring data integrity.
- 📧 **Email Notifications**: Order confirmations via NodeMailer.
- 🌍 **CORS Handling**: Secure API access for frontend applications.

## 🛠 Technologies Used
- **🟢 Node.js** - Backend runtime.
- **⚡ Express.js** - Framework for building APIs.
- **🗄️ MongoDB (MongooseDB)** - NoSQL database for scalable data management.
- **🔑 JWT (JSON Web Token)** - Secure authentication.
- **📷 Cloudinary** - Image storage and optimization.
- **🌐 CORS** - Handling cross-origin requests.
- **📨 NodeMailer** - Sending transactional emails.
- **📮 Postman** - API testing and development.

## 🚀 Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/zofo.git
cd zofo
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file and add the following variables:
```
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
```

### 4️⃣ Start the Server
```sh
npm start
```

## 📘 Usage
1. **🔑 Register/Login**: Create an account or log in.
2. **🛒 Browse & Search**: View products and apply filters.
3. **🛍️ Add to Cart & Checkout**: Securely add items to the cart and complete purchases.
4. **📦 Manage Orders**: Track order history and status.

## 🛠 API Testing
Use **Postman** to test API endpoints with the provided Postman Collection.

## 📜 License
This project is licensed under the **MIT License**.
