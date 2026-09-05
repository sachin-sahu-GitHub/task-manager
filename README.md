# Beginner MERN Notes App

A small full-stack notes application built to demonstrate the complete path from React to Express to MongoDB. Users can register, log in, create notes, edit them, delete them, and log out. Every note belongs to one authenticated user.

## Features

- Registration with a bcrypt-hashed password
- Login that returns a one-day JWT
- Protected note create, read, update, and delete APIs
- User isolation: a note query always includes both its id and the logged-in user id
- Simple React pages for login, registration, and notes
- Basic validation and beginner-focused comments

## Technologies

- MongoDB + Mongoose for persistent data
- Express + Node.js for the API
- React + Vite for the browser UI
- `bcryptjs` for password hashing and `jsonwebtoken` for JWTs

## Folder structure

```text
server/
  models/          User and Note database shapes
  middleware/      JWT verification
  routes/          Authentication and notes endpoints
  server.js         Express and MongoDB setup
client/src/
  components/      Small reusable UI pieces
  pages/           Login, Register, and Notes screens
  services/api.js  All fetch requests and localStorage session helpers
```

## Installation and running

1. Install Node.js 18+ and make sure MongoDB is running locally, or create a free MongoDB Atlas database.
2. In `server`, copy `.env.example` to `.env` and set a real `MONGO_URI` and a long random `JWT_SECRET`.
3. From the project root, install both projects:

   ```bash
   npm run install-all
   ```

4. In terminal one, start the API:

   ```bash
   npm run server
   ```

5. In terminal two, start React:

   ```bash
   npm run client
   ```

6. Open the local URL printed by Vite (normally `http://localhost:5173`).

Do not commit `server/.env`; it contains the database location and JWT secret.

## API endpoints

| Method | Endpoint | Purpose | Token needed |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Create a user | No |
| POST | `/api/auth/login` | Verify password and receive a JWT | No |
| GET | `/api/notes` | Get the logged-in user's notes | Yes |
| POST | `/api/notes` | Create a note | Yes |
| PUT | `/api/notes/:id` | Update one owned note | Yes |
| DELETE | `/api/notes/:id` | Delete one owned note | Yes |

Protected requests use this header:

```text
Authorization: Bearer <token>
```

## How the project works

```text
User
  ↓
React form or button
  ↓  fetch /api/...
Express API route
  ↓  (notes routes pass through JWT middleware)
MongoDB via Mongoose
  ↓
JSON response
  ↓
React updates the UI
```

### Authentication flow

Registration sends name, email, and password to Express. The server checks the input and duplicate email, hashes the password with bcrypt, then saves the user. The original password is never stored.

Login finds the email, compares the submitted password against the stored hash, and signs a JWT containing `{ userId }`. React saves the token and safe user details in `localStorage`.

For a notes request, `api.js` reads that token and sends the Authorization header. `authMiddleware.js` verifies its signature using `JWT_SECRET`, obtains `userId`, and places it on `req.userId`. The note route uses that id in MongoDB queries. A user therefore cannot fetch, update, or delete another user's notes, even if they guess its id.

### MongoDB data flow

The `User` collection stores name, email, password hash, and timestamps. The `Note` collection stores title, content, timestamps, and a `user` ObjectId that references the owner. `Note.find({ user: req.userId })` returns only the logged-in person's notes.

## Quick manual test checklist

1. Register a user, then try the same email again: expect “Email already exists.”
2. Log in with a wrong password: expect “Invalid email or password.”
3. Log in successfully, try a blank title and blank content (both return 400), then add a note, edit it, and delete it.
4. Call `GET /api/notes` without the Authorization header: expect 401.
5. Create two accounts. Obtain a note id from account A, then use account B's token on `PUT` or `DELETE /api/notes/:id`: expect “Note not found,” because the ownership query fails.
6. Click Logout: the token and user are removed from localStorage and the login screen returns.

## Common errors

- **MongoDB connection failed:** start the local MongoDB service, or correct `MONGO_URI` in `server/.env`.
- **Unauthorized:** log in again; the token may be missing, invalid, or expired.
- **Vite cannot reach the API:** start the backend on port 5000, or update the proxy in `client/vite.config.js`.
- **`JWT_SECRET` error:** copy `.env.example` to `.env` and set the variable before starting the server.

See [PROJECT_GUIDE.md](PROJECT_GUIDE.md) for a from-zero explanation and [INTERVIEW_GUIDE.md](INTERVIEW_GUIDE.md) for answers based on this implementation.
