# Movie Booking Application

A MERN stack application for booking movie tickets with user and admin functionalities.

## Features

- User Registration and Login
- Browse Movies
- Book Movie Tickets
- View and Cancel Bookings
- Admin Dashboard
  - Add/Remove Movies
  - Monitor Bookings
- First Come First Serve Booking System
- 120 Seats per Movie

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
- Material-UI
- JWT Authentication

## Setup Instructions

1. Clone the repository
2. Install MongoDB on your system if not already installed

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movie-booking
   JWT_SECRET=your-secret-key
   ```

4. Seed the database with sample movies:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend application:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

## Admin Account Creation

To create an admin account:
1. Register a new user through the application
2. Manually update the user's isAdmin field to true in the MongoDB database:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { isAdmin: true } }
   )
   ```

## Usage

1. Register/Login to the application
2. Browse available movies
3. Select a movie to view details
4. Book tickets by selecting the number of seats
5. View your bookings in the My Bookings section
6. Admin users can access the Admin Dashboard to manage movies and view all bookings
