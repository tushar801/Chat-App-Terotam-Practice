import express from 'express';
import 'reflect-metadata';
import dotenv from 'dotenv';
import cors from 'cors';
import { UserController } from './Management/controllers/user.controller';
import { ensureAuthenticated } from './Management/middlewares/auth.middleware';
import adminRoutes from './Management/routes/admin.routes';
import userRoutes from './Management/routes/user.routes';
import userdataRoutes from './Management/routes/userdataRoutes';
import { AppDataSource } from './config/dbconfig';
import complaintRoutes from './Management/Complaint/routes/complaintRoutes';
import { ComplaintScheduler } from './Management/Complaint/services/ComplaintScheduler'; 
import { connectMongoDB } from './config/dbconfig';


dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Connect to MongoDB
connectMongoDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));


// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    // Start the cron job once the database is connected
    ComplaintScheduler.scheduleUpcomingComplaintsJob(); // Initialize the cron job here
  })
  .catch((error) => console.error("Database connection error:", error));

// Routes
app.post('/activate', ensureAuthenticated, UserController.activate);
app.use('/api', userRoutes);
app.use('/admin', ensureAuthenticated, adminRoutes);
app.use('/user', ensureAuthenticated, userRoutes);
app.use('/files', userdataRoutes);

// Add complaint routes without authentication
app.use('/api', complaintRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

export default app;
