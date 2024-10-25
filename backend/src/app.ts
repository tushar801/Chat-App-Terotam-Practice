import express from 'express';
import 'reflect-metadata';
import dotenv from 'dotenv';
import cors from 'cors';
import { UserController } from './controllers/user.controller';
import { ensureAuthenticated } from './middlewares/auth.middleware';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';
import { AppDataSource } from './config/dbconfig';
import userdataRoutes from './routes/userdataRoutes';
import http from 'http';
import { Server } from 'socket.io';


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Initialize database connection
AppDataSource.initialize()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.error("Database connection error:", error));

// API routes
app.post('/activate', ensureAuthenticated, UserController.activate);
app.use('/api', userRoutes);
app.use('/admin', ensureAuthenticated, adminRoutes);
app.use('/user', ensureAuthenticated, userRoutes);
app.use('/files', userdataRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Create HTTP server and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true
  }
});


// Socket event handling
io.on('connection', (socket) => {
  console.log('socket connected:');

  socket.on('register', (username: string) => {
    socket.data.username = username;
    console.log(`User registered with username: ${username}`);
  });

  socket.on('join', (room: number) => {
    console.log(`${socket.data.username} is attempting to join room: ${room}`);
    const previousRoom = Array.from(socket.rooms)[1]; // Get previous room

    if (previousRoom) {
      socket.leave(previousRoom);
      console.log(`User left room: ${previousRoom}`);
      emitRoomMessage(previousRoom, `${socket.data.username} has left the room.`);
    }

    // Join the new room
    socket.join(room.toString());
    console.log(`User joined room: ${room}`);
    emitRoomMessage(room.toString(), `${socket.data.username} has joined the room ${room}.`);
  });

  socket.on('message', ({ room, msg }: { room: number; msg: string }) => {
    const timestamp = getFormattedTime();
    console.log(`Message in room ${room} from ${socket.data.username}: ${msg}`);
    io.to(room.toString()).emit('message', { msg, timestamp, from: socket.data.username });
     // Debug log to confirm message emission
    console.log(`Emitted message to room ${room}: ${msg}`);
  });

  socket.on('leave', (room: number) => {
    socket.leave(room.toString());
    emitRoomMessage(room.toString(), `${socket.data.username} has left the room.`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.data.username);
    const currentRoom = Array.from(socket.rooms)[1];
    if (currentRoom) {
      emitRoomMessage(currentRoom, `${socket.data.username} has left the room.`);
      socket.leave(currentRoom);
    }
  });
});

// Helper functions
const emitRoomMessage = (room: string, message: string) => {
  const timestamp = getFormattedTime();
  io.to(room).emit('message', { msg: message, timestamp, from: 'System' });
};

const getFormattedTime = (): string => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

// Start server
const PORT = 3003; // Set your desired port for the HTTP server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
