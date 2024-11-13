import { User } from '../models/User';
import { AppDataSource } from '../../config/dbconfig';
import { Like } from 'typeorm';
import { notifySuperadmin } from '../utils/emailNotification';


// Utility function to generate a unique ID
export async function generateUniqueId(name: string): Promise<string> {
    const userRepository = AppDataSource.getRepository(User);
    
    // Get the current count of users with the same prefix
    const count = await userRepository.count({
        where: { uniqueId: Like(`${name.slice(0, 3).toUpperCase()}000%`) }, // Check for existing IDs with the same prefix
    });

    // Generate the unique ID based on the count
    const uniqueId = `${name.slice(0, 3).toUpperCase()}000${count + 1}`; // Add 1 to count to get the new unique ID
    return uniqueId; // Return the generated unique ID
}


export class UserService {
  
// Activate a user
static async activateUser(userId: number) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
        throw new Error('User not found');
    }
    
    user.isActive = true; // Use isActive instead of status
    await userRepository.save(user); 

    // Notify the superadmin about the user activation
    await notifySuperadmin(user.email, user.role); // Notify the superadmin
     return user;
}


  // Get user details
  static async getUserDetails(userId: number) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Optionally exclude sensitive data before returning
    const { password, ...userDetails } = user;
    return userDetails; // Return user details without the password
  }
}

