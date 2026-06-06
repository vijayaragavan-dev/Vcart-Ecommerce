# 🛒 VCart - Modern E-Commerce Web Application

VCart is a full-stack e-commerce web application built with **Flask, MySQL, HTML, CSS, and JavaScript**. It provides a responsive shopping experience with secure user authentication, product browsing, cart management, and session-based login functionality.

## 🚀 Live Demo

### Frontend

https://vcart-ecommerce.vercel.app

### Backend API

https://vcart-backend-hzt1.onrender.com

---

# ✨ Features

### 👤 User Authentication

* User Registration
* User Login
* User Logout
* Session-Based Authentication
* Password Hashing using BCrypt
* Secure Authentication Middleware

### 🛍️ Shopping Experience

* Product Catalog
* Product Search
* Product Filtering
* Shopping Cart Management
* Add to Cart
* Remove from Cart
* Quantity Updates
* Cart Persistence

### 🎨 Modern UI

* Responsive Design
* Mobile Friendly Interface
* Smooth Animations
* Clean User Experience
* Modern E-Commerce Layout

### 🔒 Security

* Environment Variable Configuration
* Secure Session Management
* Password Encryption
* CORS Protection
* GitHub Safe Configuration

---

# 🏗️ Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript (ES6)

## Backend

* Python
* Flask
* Flask-CORS
* BCrypt

## Database

* MySQL

## Deployment

* Vercel (Frontend)
* Render (Backend)
* Railway (Database)

---

# 📁 Project Structure

```text
VCart/
│
├── backend/
│   ├── auth/
│   ├── middleware/
│   ├── app.py
│   ├── config.py
│   ├── database.py
│   ├── schema.sql
│   └── requirements.txt
│
├── css/
│   ├── style.css
│   └── responsive.css
│
├── js/
│   ├── auth.js
│   ├── cart.js
│   ├── config.js
│   ├── main.js
│   ├── products.js
│   └── utils.js
│
├── pages/
│
└── index.html
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/VCart-Ecommerce.git
cd VCart-Ecommerce
```

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file:

```env
SECRET_KEY=your_secret_key

MYSQLHOST=localhost
MYSQLUSER=root
MYSQLPASSWORD=your_password
MYSQLDATABASE=vcart
MYSQLPORT=3306

FRONTEND_URL=http://localhost:5500
```

Run Backend:

```bash
python app.py
```

---

## Frontend Setup

Simply open:

```text
index.html
```

or use:

```bash
python -m http.server 5500
```

---

# 🔗 API Endpoints

## Authentication

### Signup

```http
POST /api/auth/signup
```

### Login

```http
POST /api/auth/login
```

### Logout

```http
POST /api/auth/logout
```

### Session Check

```http
GET /api/auth/session
```

### Health Check

```http
GET /api/health
```

---

# 🌐 Deployment Architecture

```text
Frontend (Vercel)
        │
        ▼
Backend API (Render)
        │
        ▼
MySQL Database (Railway)
```

---

# 📸 Screenshots

Add screenshots of:

* Home Page
* Product Listing
* Product Details
* Cart Page
* Login Page
* Signup Page

---

# 🎯 Future Enhancements

* Product Categories
* Wishlist
* Payment Gateway Integration
* Order Tracking
* Admin Dashboard
* Product Reviews
* Inventory Management
* Email Verification
* Password Reset

---

# 👨‍💻 Developer

**Vijayaragavan**

* B.E Computer Science and Engineering
* Saranathan College of Engineering
* Trichy, Tamil Nadu, India

### Skills

* Python
* Java
* C/C++
* HTML
* CSS
* JavaScript
* MySQL
* Flask

---

# ⭐ Support

If you like this project:

⭐ Star the repository

🍴 Fork the repository

🚀 Contribute and improve VCart

---

# 📄 License

This project is licensed under the MIT License.

Feel free to use, modify, and distribute this project for educational and personal purposes.
