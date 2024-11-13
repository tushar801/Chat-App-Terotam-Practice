//This service will handle admin-specific operations, like creating users with roles (admin, staff, customer) and other actions the superadmin can perform.

import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AppDataSource } from '../../config/dbconfig';
import { Role } from '../types/role.enum';
import { generateUniqueId } from './user.service';
import { createToken } from '../utils/jwt.util';

export class AdminService {
  static async createUser({ name, email, mobile, role }: { name: string, email: string, mobile: string, role: string }) {
    const userRepository = AppDataSource.getRepository(User);

    // Check if the role is valid
    if (![Role.Admin, Role.Staff, Role.Customer].includes(role as Role)) {
      throw new Error('Invalid role');
    }

    // Check if email or mobile already exists
    const existingUser = await userRepository.findOne({ where: [{ email }, { mobile }] });
    if (existingUser) {
      throw new Error('User with this email or mobile already exists');
    }

    // Generate a unique ID for the user
    const uniqueId = await generateUniqueId(name);

    // Hash the password (using a default password, which can be changed later by the user)
    const defaultPassword = 'password123'; // You can prompt the admin to provide a password or send it via email
    const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

    // Create new user entity
// const Token = await createToken({id: uniqueId})
    const newUser = userRepository.create({
      name,
      email,
      mobile,
      uniqueId,
      password: hashedPassword,
      role,
      isActive: false,
      // jwt_token: Token,// New users start as inactive// New users start as inactive
    });

    // Save the new user to the database
    await userRepository.save(newUser);

    return newUser;
  }

  static async activateUser(userId: number) {
    const userRepository = AppDataSource.getRepository(User);

    // Find the user by ID
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
     
       // Activate the user
      user.isActive = true; // Set isActive to true
      
    // Save the updated user to the database
    await userRepository.save(user);
  }

  static async deactivateUser(userId: number) {
    const userRepository = AppDataSource.getRepository(User);

    // Find the user by ID
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Deactivate the user
    user.isActive = false; // Set isActive to false

    // Save the updated user to the database
    await userRepository.save(user);
  }

  static async updateUserRole(userId: number, newRole: string) {
    const userRepository = AppDataSource.getRepository(User);

    // Check if the new role is valid
    if (![Role.Admin, Role.Staff, Role.Customer].includes(newRole as Role)) {
      throw new Error('Invalid role');
    }

    // Find the user by ID
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's role
    user.role = newRole;

    // Save the updated user to the database
    await userRepository.save(user);
  }
}

