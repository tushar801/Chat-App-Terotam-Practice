import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AppDataSource } from '../../config/dbconfig';
import { User } from '../models/User'; 
import { notifySuperadmin } from '../utils/emailNotification'; 

export class UserController {
    
    // Method for activating a user
    static async activate(req: Request, res: Response) {
        const { userId } = req.body; // Get userId from the request body
        try {
            // Calls the UserService to handle user activation
            const user = await UserService.activateUser(userId); // Assuming this method activates the user

            // Notify superadmin about user activation
            await notifySuperadmin(user.email, user.role);

            return res.status(200).json({ message: 'User activated successfully' });
        } catch (error: any) {
            return res.status(400).json({ message: 'Activation failed', error: error.message });
        }
    }

    // Method for changing the status of a user (active/inactive)
    static async changeStatus(req: Request, res: Response) {
        const { userId, isActive } = req.body; // Expecting userId and isActive (boolean)

        try {
            // Use DataSource to get the user repository
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ id: userId });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Only allow status change for customers, staff, and admins
            if (user.role === 'superadmin') {
                return res.status(403).json({ message: 'Superadmin cannot change status' });
            }

            // Update user status
            user.isActive = isActive;
            await userRepository.save(user);

            // If user is now active, notify superadmin
            if (isActive) {
                await notifySuperadmin(user.email, user.role);
            }

            return res.status(200).json({ message: `User status updated to ${isActive ? 'active' : 'inactive'}` });
        } catch (error: any) {
            return res.status(400).json({ message: 'Error changing status', error: error.message });
        }
    }


}
