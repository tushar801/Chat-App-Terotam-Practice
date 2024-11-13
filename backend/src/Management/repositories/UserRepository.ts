import { AppDataSource } from '../../config/dbconfig';
import { User } from '../models/User';

export class UserRepository {
    // Fetch specific data for users who are active
    static async fetchActiveUsers() {
        const repository = AppDataSource.getRepository(User);
        return await repository.find({
            where: { isActive: true }, // Only fetch active users
            select: ['name', 'email', 'mobile', 'uniqueId', 'role', 'isActive'],
        });
    }
}