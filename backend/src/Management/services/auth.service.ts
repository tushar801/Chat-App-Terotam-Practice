import { User } from '../models/User';
import { AppDataSource } from '../../config/dbconfig';
import { createToken } from '../utils/jwt.util';
import { generateUniqueId } from './user.service';

export class AuthService {

  // Register a new user (with plain text password)
  static async register({ name, email, mobile, password }: { name: string; email: string; mobile: string; password: string }) {
    const userRepository = AppDataSource.getRepository(User);
    
    const uniqueId = await generateUniqueId(name); // Generate unique ID
    const user = userRepository.create({ name, email, mobile, uniqueId, password }); // Save plain password
    await userRepository.save(user);
    
    console.log("Registered user:", user); // Check registered user details
    return user;
  }

  // User login (with plain password check)
  static async login(identifier: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);

    let user;
    try {
      user = await userRepository.findOne({
        where: [{ email: identifier }, { mobile: identifier }, { uniqueId: identifier }],
      });
    } catch (error) {
      console.error("Database access error:", error); // Log any database access error
      throw new Error('Internal server error'); // Generic error message for internal issues
    }

    console.log("User found:", user); // Log the found user

    if (!user) {
      console.error('User not found'); // Log if user not found
      throw new Error('User not found');
    }
    

    if (password !== user.password) {
      console.error('Invalid password'); // Log invalid password case
      throw new Error('Invalid password');
    }

    // Create the token
    const token = createToken({ id: user.id, role: user.role });

    // Log the generated token
    console.log("Generated Token:", token);

    return { token, user };
  }
}
