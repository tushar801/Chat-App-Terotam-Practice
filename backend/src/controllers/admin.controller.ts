//This controller allows superadmin to create users with different roles (admin, staff, customer).
// Yeh controller admin se related operations ko handle karta hai.
// createUser method superadmin ko naye users (admin, staff, customer) create karne ki functionality deta hai.
// Agar user successfully create hota hai to response 201 status ke saath return hota hai, warna error message ke saath 400 status return hota hai.



import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {
  static async createUser(req: Request, res: Response) {
    const { name, email, mobile, role } = req.body;
    try {
      const user = await AdminService.createUser({ name, email, mobile, role });
      return res.status(201).json({ user });
    } catch (error) {
      return res.status(400).json({ message: 'Failed to create user' });
    }
  }
}
