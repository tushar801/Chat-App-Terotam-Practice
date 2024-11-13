import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is defined and assert its type
const jwtSecret: string = process.env.JWT_SECRET as string || '';
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export function createToken(payload: object): string {
  // Generate and return the token
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  
  // Log the token for Postman usage
  console.log("Generated Token:", token);
  
  return token;
}

export function verifyToken(token: string): any {
  try {
    // Verify the token and return the decoded payload
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    // Handle invalid or expired token errors
    throw new Error('Invalid or expired token');
  }
}
