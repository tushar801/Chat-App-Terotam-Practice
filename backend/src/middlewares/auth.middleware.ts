import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  userId?: any; // or string, depending on your ID type
}

export const ensureAuthenticated = (req: CustomRequest, res: Response, next: NextFunction) => {
  console.log("Request headers:", req.headers); // Log headers
  const token = req.headers.authorization?.split(' ')[1]; // Get the token part from Bearer token

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const jwtSecret = process.env.JWT_SECRET; 

  if (!jwtSecret) {
    return res.status(500).json({ message: 'JWT secret not configured' });
  }

  try {
    const decoded = verify(token, jwtSecret) as JwtPayload; // Verify the token
    req.userId = decoded.id; // Set userId from decoded token
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
