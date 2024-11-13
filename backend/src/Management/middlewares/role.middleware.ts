//This checks if the user has the required role for accessing a specific route.

import { Request, Response, NextFunction } from 'express';

export function roleMiddleware(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // Typecasting to 'any'
    if (!user || user.role !== role) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}
