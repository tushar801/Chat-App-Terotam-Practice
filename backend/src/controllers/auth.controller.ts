import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';



//is file m register ka data aa rha h or userService ko ja rha h databse m store krane k liye or  frontend se login krte time data aa rha h usko destructure kr rhe h or authservice ki help se us code m 
// phle database m check kr rhe h ki y identifier password shi h agr shi h to token generate kr do 

export class AuthController {


// Method for registering a new user
    static async register(req: Request, res: Response) {
        const { name, email, mobile, password } = req.body;
        try {
            // Calls the UserService to handle registration
            const user = await AuthService.register({ name, email, mobile, password });
            return res.status(201).json({ user });
        } catch (error: any) {
            return res.status(400).json({ message: 'Registration failed', error: error.message });
        }
    }


static async login(req: Request, res: Response) {
    console.log("Request body:", req.body); // Check what is being received
    const { identifier, password } = req.body; // Change email to identifier

   // Input validation
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier and password are required' });
    }

    try {
      const { token, user } = await AuthService.login(identifier, password); // Pass identifier instead of email
      console.log(token, "username", user.name)
      return res.status(200).json({message: 'User logged in successfully', 
        token,
        username: user.name       });
    } catch (error) {
      // Type assertion for error
      const errorMessage = (error as Error).message || 'Something went wrong';
      console.error("Login error:", error); // Log the error
      return res.status(400).json({ error: errorMessage }); // Send back error message
    }
  }
}
