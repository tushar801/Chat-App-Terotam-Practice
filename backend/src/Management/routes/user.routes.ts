import { Router } from 'express';
import { UserService } from '../services/user.service';
import { AuthController } from '../controllers/auth.controller';


const router = Router();

// Route to register a user
router.post('/register', AuthController.register); 

// Route to login a user
router.post('/login', AuthController.login);


// Route to get user details (after login)
router.get('/me', async (req, res) => {
    try {
        // Type assertion to tell TypeScript that req.user exists
        const userId = (req as any).user.id  // Assuming you have a middleware that sets req.user
        
        const userDetails = await UserService.getUserDetails(userId);
        return res.status(200).json(userDetails);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
});

export default router;
