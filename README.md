# QBox Backend API

Backend API server for QBox - Anonymous Q&A Platform for Students

## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- Socket.io for real-time communication
- JWT Authentication
- Nodemailer for email services

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables
4. Start server: `npm start` or `npm run dev`

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password` - Reset password

### Rooms
- POST `/api/rooms` - Create room
- GET `/api/rooms` - Get all rooms
- POST `/api/rooms/join` - Join room with code
- DELETE `/api/rooms/:id` - Delete room

### Questions
- POST `/api/questions` - Ask question
- GET `/api/questions/room/:roomId` - Get room questions
- PUT `/api/questions/:id/upvote` - Upvote question
- PUT `/api/questions/:id/answer` - Mark as answered
- DELETE `/api/questions/:id` - Delete question

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update profile
- PUT `/api/users/change-password` - Change password

## Environment Variables

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## License

MIT
