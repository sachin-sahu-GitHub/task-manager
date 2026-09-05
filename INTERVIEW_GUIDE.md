# Interview Guide

These answers describe the code in this repository. Adjust personal wording, but do not claim features that are not present.

1. **Explain your Notes App.** It is a MERN notes app with registration, login, JWT-protected note CRUD, and logout. Each note has an owner, so users can manage only their own notes.
2. **Why MongoDB?** It stores JSON-like user and note documents naturally. Mongoose gives simple schemas and queries from Node.js.
3. **Why Express?** It makes it straightforward to create API routes and middleware in JavaScript.
4. **Why React?** It keeps form state and renders the notes list when API data changes, without reloading the page.
5. **What is JWT?** It is a server-signed token proving a user logged in. In this project it carries a user id and expires after one day.
6. **How does JWT authentication work here?** Login creates the token; React stores it and sends it in an Authorization header; middleware verifies it before any notes route runs.
7. **Where is JWT generated?** In the login route, with `jwt.sign` in `server/routes/authRoutes.js`.
8. **Where is JWT verified?** In `server/middleware/authMiddleware.js` using `jwt.verify`.
9. **What is middleware?** It is a function that runs before the final route. Mine reads and verifies the token, then adds `req.userId`.
10. **Why bcrypt?** It hashes passwords before saving them, so a database leak does not reveal original passwords.
11. **Why should passwords be hashed?** A hash is one-way. The server can compare a login password to it without storing the readable password.
12. **How are notes connected to users?** Each Note has a `user` ObjectId referring to its User owner.
13. **How do you prevent cross-user access?** Read queries filter by `user: req.userId`; update and delete queries filter by both note id and `user: req.userId`.
14. **What happens on login?** The API finds the email, compares bcrypt hashes, creates a JWT, and returns it with safe user fields. React saves the session.
15. **What happens when a user creates a note?** React sends title/content plus JWT. Middleware finds the user id and the API saves it into the note's `user` field.
16. **What happens when a user deletes a note?** The API verifies the token then deletes only a document matching both the requested id and owner id.
17. **What happens when JWT is invalid?** Middleware returns a 401 response and the protected route does not execute.
18. **What APIs did you create?** Register/login plus GET, POST, PUT, and DELETE for `/api/notes`.
19. **What was most challenging?** Connecting identity to every data operation. I solved it by attaching `req.userId` in one middleware and using it in every note query.
20. **How did you test it?** I tested registration, duplicate emails, wrong passwords, note CRUD, missing fields, missing token, and cross-user note-id attempts. The README contains the checklist.
21. **What bugs did you find?** Typical cases to watch for were blank note fields and treating a guessed note id as sufficient permission. Input checks and owner-aware queries handle these cases.
22. **What would you improve?** I would add refresh tokens or safer cookie sessions, stronger email validation/rate limiting, pagination, tests with an isolated MongoDB instance, and deployment configuration. These are future improvements, not current features.
