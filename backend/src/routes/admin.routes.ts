import { Router, Request, Response } from 'express'; 
import { AdminService } from '../services/admin.service';

const router = Router();

// Route to create a user
router.post('/create', async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, mobile, role } = req.body;
        const newUser = await AdminService.createUser({ name, email, mobile, role });
        return res.status(201).json(newUser);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';
        return res.status(400).json({ message: errorMessage });
    }
});


  


// Route to update user role
router.patch('/update-role/:id', async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = parseInt(req.params.id);
        const { newRole } = req.body;
        await AdminService.updateUserRole(userId, newRole);
        return res.status(200).json({ message: 'User role updated successfully' });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';
        return res.status(400).json({ message: errorMessage });
    }
});

export default router;
