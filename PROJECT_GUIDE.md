# Project Guide: MERN Notes App from Zero

This app has one job: let a user manage only their own notes after proving who they are. It uses a browser UI (React), an API (Express/Node), and a database (MongoDB).

## 1. What is MERN?

MERN is MongoDB, Express, React, and Node.js. React displays the UI. Express receives requests. Node runs the Express code. MongoDB stores users and notes.

## 2. What is MongoDB?

MongoDB stores JSON-like documents in collections. Here, the `users` collection stores accounts and `notes` stores notes. Mongoose lets JavaScript define schemas and query those collections.

## 3. What is Express?

Express is a Node library for creating URLs such as `POST /api/auth/login`. A route receives `req` (the request) and sends `res` (the response).

## 4. What is React?

React builds the visible page from components. It holds temporary form values in state and redraws the screen when state changes. This project uses only a few components and normal CSS.

## 5. What is Node.js?

Node.js runs JavaScript outside the browser. Here it runs `server/server.js`, connects MongoDB, and starts Express on port 5000.

## 6. What is a REST API?

It is a group of URLs that use HTTP methods: GET reads, POST creates, PUT updates, and DELETE removes. React sends JSON to these URLs and receives JSON back.

## 7. What is JWT?

JWT means JSON Web Token. It is a signed string that the server creates after a successful login. This app's token has the user id as its payload. The signature lets the server detect a changed or fake token. A JWT is not an encrypted password and must not contain a password.

## 8. What is bcrypt?

bcrypt turns a password into a one-way hash. The server saves that hash, not the original password. At login, `bcrypt.compare` checks the submitted password against the hash.

## 9. How registration works

```text
Frontend Register form
  ↓ POST /api/auth/register
Backend validates input and checks the email
  ↓ bcrypt.hash(password)
MongoDB saves the user with the password hash
  ↓ JSON success response
Frontend shows a success message
```

## 10. How login works

```text
Frontend Login form
  ↓ POST /api/auth/login
Backend finds email and bcrypt.compare checks password
  ↓
Backend creates a signed JWT
  ↓ token and safe user details
Frontend saves them in localStorage and shows Notes
```

## 11. How JWT is generated

In `server/routes/authRoutes.js`, `jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1d' })` creates it. The secret signs the token and is read from `.env`; it is never put in React code.

## 12. How React sends JWT to backend

`client/src/services/api.js` reads the token from localStorage. For a request it adds `Authorization: Bearer <token>` to the headers. The word “Bearer” is a standard way to say that the following value is the credential.

## 13. How JWT middleware works

```text
Frontend protected request with Authorization header
  ↓
authMiddleware reads and extracts token after "Bearer "
  ↓ jwt.verify(token, JWT_SECRET)
Valid token → middleware sets req.userId → route continues
Invalid/missing token → backend returns 401 → route does not run
```

Middleware is code that runs between receiving a request and running a final route handler. `router.use(authMiddleware)` applies it to every notes route.

## 14. How notes are created

```text
Frontend note form
  ↓ POST /api/notes with token, title, content
JWT middleware puts login user id on req.userId
  ↓
Backend creates { title, content, user: req.userId }
  ↓ MongoDB note document
Frontend reloads and displays notes
```

## 15. How notes are fetched

After verification, the API runs `Note.find({ user: req.userId })`. The `user` field is the ownership link. MongoDB only returns matching documents, then React maps them to `NoteCard` components.

## 16. How notes are updated

The UI sends `PUT /api/notes/:id`. The server uses `findOneAndUpdate({ _id: id, user: req.userId }, ...)`. Both parts must match. If the note belongs to someone else, no document is found and the response is 404.

## 17. How notes are deleted

The UI sends `DELETE /api/notes/:id`. The server uses `findOneAndDelete({ _id: id, user: req.userId })`, which applies the same ownership rule before removing anything.

## 18. How logout works

Logout is simple here: `clearSession()` removes the token and user from browser localStorage, React changes back to the login view, and later protected calls no longer have a token.

## Files worth reading first

1. `server/server.js` — server and database startup.
2. `server/routes/authRoutes.js` — register, login, hash, and JWT creation.
3. `server/middleware/authMiddleware.js` — JWT verification.
4. `server/routes/noteRoutes.js` — protected CRUD and ownership checks.
5. `client/src/services/api.js` — every frontend request and Authorization header.
6. `client/src/App.jsx` and `client/src/pages/Notes.jsx` — session and UI flow.

