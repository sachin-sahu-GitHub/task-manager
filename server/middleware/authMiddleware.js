import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  // The frontend sends: Authorization: Bearer <JWT>
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: token is missing' });
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    // verify checks that the token was signed with our secret and has not expired.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // The login route stored the user id in the token payload. Routes use it to
    // read and change only this user's notes.
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
}

