# Event Planner Backend

## Theme

This backend application implements an **Event Planner** system that allows users to manage events with titles, dates, and locations.

## Features

- **CRUD Operations**: Create, read, update, and delete events
- **Authentication**: JWT-based authentication with user registration and login
- **Authorization**: Role-based access control (RBAC) with admin and regular user roles
- **Search & Filtering**: Filter events by type, date, and title
- **Validation**: Request validation using Joi
- **Database**: MongoDB with Mongoose

## API Endpoints

### Authentication Routes

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Event Routes (Items)

**Public Routes (accessible to all authenticated users):**
- `GET /items` - Retrieve all events (with optional query parameters: `type`, `date`, `title`)
- `GET /items/:id` - Retrieve a single event by ID

**Admin-Only Routes:**
- `POST /items` - Create a new event
- `PUT /items/:id` - Update an event
- `DELETE /items/:id` - Delete an event

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
PORT=4000
```

3. Start the server:
```bash
npm start
# or for development
npm run dev
```

## Testing

Use the `requests.http` file or Postman to test all endpoints. Make sure to:
1. Register a user (optionally with `role: "admin"`)
2. Login to get a JWT token
3. Use the token in the `Authorization: Bearer <token>` header for protected routes

