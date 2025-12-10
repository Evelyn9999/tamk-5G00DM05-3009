# Event Planner Backend API

A complete RESTful backend application for managing events with JWT authentication, role-based access control, and MongoDB database integration.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Testing](#-testing)
- [Database Schema](#-database-schema)
- [Error Handling](#️-error-handling)

## 🎯 Overview

This project is a **Event Planner** backend application built as part of Exercise 3 for the Full Stack Web Development course. It demonstrates:

- Complete CRUD operations for events
- JWT-based authentication system
- Role-based access control (Admin/User)
- Input validation using Joi
- MongoDB database integration
- RESTful API design

## ✨ Features

- **CRUD Operations**: Full create, read, update, and delete functionality for events
- **Authentication**: Secure JWT-based user authentication with bcrypt password hashing
- **Authorization**: Role-based access control (RBAC) with admin and regular user roles
- **Search & Filtering**: Filter events by type, date, and title using query parameters
- **Validation**: Comprehensive input validation using Joi schemas
- **Database**: MongoDB with Mongoose ODM for data persistence
- **Error Handling**: Proper HTTP status codes and error messages

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (MongoDB Atlas)
- **ODM**: Mongoose 9.0.1
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt 6.0.0
- **Validation**: Joi 18.0.2
- **Environment**: dotenv 17.2.3

## 📁 Project Structure

```
event-planner-backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js      # Authentication logic (register, login)
│   └── eventController.js    # Event CRUD operations
├── middleware/
│   └── authMiddleware.js     # JWT authentication & admin authorization
├── models/
│   ├── Event.js              # Event Mongoose schema
│   └── User.js               # User Mongoose schema
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   └── eventRoutes.js        # Event routes
├── validators/
│   ├── authValidator.js     # Joi validation for auth endpoints
│   └── eventValidator.js    # Joi validation for event endpoints
├── app.js                    # Express application entry point
├── seed.js                   # Database seeding script
├── requests.http             # REST Client test file
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Step 1: Clone/Download the Project

```bash
# Navigate to project directory
cd event-planner-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eventDB?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=1h
PORT=4000
```

**Important:**
- Replace `username` and `password` with your MongoDB Atlas credentials
- Replace `cluster0.xxxxx.mongodb.net` with your cluster connection string
- Use a strong, random string for `JWT_SECRET` (e.g., generate with: `openssl rand -base64 32`)

### Step 4: Start the Server

```bash
# Production mode
npm start

# Development mode (with nodemon for auto-reload)
npm run dev
```

The server will start on `http://localhost:4000` (or the port specified in `.env`).

### Step 5: Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 4 users (1 admin, 3 regular users)
- 10 sample events

**Test Credentials:**
- Admin: `username: "admin"`, `password: "admin123"`
- User: `username: "john"`, `password: "user123"`

## 📚 API Documentation

### Base URL

```
http://localhost:4000
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "username": "john",
  "password": "user123",
  "role": "user"  // optional: "user" or "admin"
}
```

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "john",
  "role": "user"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "role": "admin"
  }
}
```

### Event Endpoints

All event endpoints use the `/items` path (as per assignment requirements).

#### Get All Events

**Access:** All authenticated users

```http
GET /items
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` - Filter by event type (`meeting`, `birthday`, `exam`, `other`)
- `date` - Filter by date (format: `YYYY-MM-DD`)
- `title` - Search in title (case-insensitive)

**Examples:**
```http
GET /items?type=meeting
GET /items?date=2025-01-15
GET /items?title=exam
GET /items?type=exam&date=2025-02-01
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Team Meeting",
    "date": "2025-01-15T10:00:00.000Z",
    "location": "Conference Room A",
    "type": "meeting",
    "createdAt": "2025-12-10T10:14:10.263Z",
    "updatedAt": "2025-12-10T10:14:10.263Z"
  }
]
```

#### Get Single Event

**Access:** All authenticated users

```http
GET /items/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Team Meeting",
  "date": "2025-01-15T10:00:00.000Z",
  "location": "Conference Room A",
  "type": "meeting",
  "createdAt": "2025-12-10T10:14:10.263Z",
  "updatedAt": "2025-12-10T10:14:10.263Z"
}
```

#### Create Event

**Access:** Admin only

```http
POST /items
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Team Meeting",
  "date": "2025-01-15T10:00:00.000Z",
  "location": "Conference Room A",
  "type": "meeting"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Team Meeting",
  "date": "2025-01-15T10:00:00.000Z",
  "location": "Conference Room A",
  "type": "meeting",
  "createdAt": "2025-12-10T10:14:10.263Z",
  "updatedAt": "2025-12-10T10:14:10.263Z"
}
```

#### Update Event

**Access:** Admin only

```http
PUT /items/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated Team Meeting",
  "location": "Conference Room B"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated Team Meeting",
  "date": "2025-01-15T10:00:00.000Z",
  "location": "Conference Room B",
  "type": "meeting",
  "createdAt": "2025-12-10T10:14:10.263Z",
  "updatedAt": "2025-12-10T10:20:15.123Z"
}
```

#### Delete Event

**Access:** Admin only

```http
DELETE /items/:id
Authorization: Bearer <admin_token>
```

**Response (204 No Content)**

## 🔐 Authentication

### How Authentication Works

1. **Register/Login**: User provides credentials and receives a JWT token
2. **Protected Routes**: Include token in `Authorization` header: `Bearer <token>`
3. **Token Validation**: Middleware validates token and extracts user information
4. **Role Check**: Admin-only routes verify user has `admin` role

### Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Role-Based Access

- **Admin**: Can perform all operations (GET, POST, PUT, DELETE)
- **User (Regular)**: Can only read events (GET)

## 🧪 Testing

### Using REST Client (VS Code)

1. Install the "REST Client" extension in VS Code
2. Open `requests.http` file
3. Update tokens in the file (get from login response)
4. Click "Send Request" above each request

### Using Postman

1. Import the API collection (or manually create requests)
2. Register a user → Copy the token from response
3. Set token in Postman environment variable
4. Use `{{token}}` in Authorization header for protected routes

### Test Scenarios

The `requests.http` file includes tests for:

- ✅ User registration (valid/invalid data)
- ✅ User login (valid/invalid credentials)
- ✅ GET all events (with/without filters)
- ✅ GET single event
- ✅ POST create event (admin only)
- ✅ PUT update event (admin only)
- ✅ DELETE event (admin only)
- ✅ Error cases (unauthorized, forbidden, validation errors)

## 🗄 Database Schema

### Event Model

```
{
  title: String (required, 1-200 chars)
  date: Date (required, ISO format)
  location: String (required, 1-200 chars)
  type: String (required, enum: ['meeting', 'birthday', 'exam', 'other'])
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### User Model

```
{
  username: String (required, unique, 3-32 chars)
  passwordHash: String (required, bcrypt hashed)
  role: String (enum: ['user', 'admin'], default: 'user')
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## ⚠️ Error Handling

The API returns appropriate HTTP status codes:

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found (resource doesn't exist) |
| 409 | Conflict (e.g., username already taken) |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "error": "Error message description"
}
```

### Example Error Responses

**401 Unauthorized:**
```json
{
  "error": "Token missing or invalid"
}
```

**403 Forbidden:**
```json
{
  "error": "Admin access required"
}
```

**400 Bad Request (Validation):**
```json
{
  "error": "\"title\" is required"
}
```

## 📝 Available Scripts

```bash
# Start server (production)
npm start

# Start server (development with auto-reload)
npm run dev

# Seed database with sample data
npm run seed
```

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens with expiration
- ✅ Input validation on all endpoints
- ✅ Role-based access control
- ✅ Environment variables for sensitive data
- ✅ CORS enabled for cross-origin requests

## 📦 Dependencies

### Production Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `joi` - Input validation
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

## 🎓 Assignment Requirements

This project fulfills all requirements for Exercise 3:

- ✅ **Theme**: Event Planner (documented)
- ✅ **CRUD Operations**: All implemented
- ✅ **Public Routes**: GET /items, GET /items/:id (authenticated users)
- ✅ **Protected Routes**: POST, PUT, DELETE (admin only)
- ✅ **Search/Filtering**: Type, date, title query parameters
- ✅ **Validation**: Joi validation on all endpoints
- ✅ **Database**: MongoDB with Mongoose
- ✅ **Authentication**: JWT with bcrypt password hashing
- ✅ **Authorization**: Role-based access control (admin/user)
- ✅ **Testing**: REST Client test file provided

## 📸 Screenshots

See submission package for screenshots of:
- Server running and database connection
- API testing in REST Client/Postman
- MongoDB Atlas database view
- Authentication flow
- CRUD operations
- Error handling

## 👤 Author

Created as part of Full Stack Web Development course - Exercise 3

## 📄 License

ISC

---

**Note:** Make sure to keep your `.env` file secure and never commit it to version control. The `.gitignore` file is configured to exclude sensitive files.
