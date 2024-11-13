import { Server } from 'socket.io';
import http from 'http';
import * as admin from 'firebase-admin';

export const configureSocket = (server: http.Server) => {
  const io = new Server(server, { cors: { origin: "*", credentials: true } });

    // In-memory storage for FCM tokens (mapping rooms to FCM tokens)
  const fcmTokens: { [room: string]: string[] } = {}; 

  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    socket.on('register', ({ username, fcmToken }: { username: string; fcmToken: string }) => {
      socket.data.username = username;
      socket.data.fcmToken = fcmToken;  // Save the FCM token on the socket
      console.log(`User registered with username: ${username}`);
    });

    socket.on('join', (room: number) => {
      console.log(`${socket.data.username} is joining room: ${room}`);
      socket.join(room.toString());
      
      // Store the FCM token for this room
      if (!fcmTokens[room.toString()]) {
        fcmTokens[room.toString()] = [];
      }
      if (socket.data.fcmToken) {
        fcmTokens[room.toString()].push(socket.data.fcmToken);
      }

      emitRoomMessage(io, room.toString(), `${socket.data.username} has joined the room.`);
      sendPushNotification(room.toString(), `${socket.data.username} has joined the room.`, fcmTokens);
    });

    socket.on('message', ({ room, msg }: { room: number; msg: string }) => {
      const timestamp = getFormattedTime();
      console.log(`Message in room ${room} from ${socket.data.username}: ${msg}`);
      io.to(room.toString()).emit('message', { msg, timestamp, from: socket.data.username });
    });

    socket.on('leave', (room: number) => {
      socket.leave(room.toString());
      emitRoomMessage(io, room.toString(), `${socket.data.username} has left the room.`);
      sendPushNotification(room.toString(), `${socket.data.username} has left the room.`, fcmTokens);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.username);
      socket.rooms.forEach((room) => {
        emitRoomMessage(io, room, `${socket.data.username} has left the room.`);
        sendPushNotification(room, `${socket.data.username} has left the room.`, fcmTokens);
      });
    });
  });
};

// Helper function for sending messages to a room
const emitRoomMessage = (io: Server, room: string, message: string) => {
  const timestamp = getFormattedTime();
  io.to(room).emit('message', { msg: message, timestamp, from: 'System' });
};

// Helper function for formatting time
const getFormattedTime = (): string => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

// Function to send push notification using FCM
const sendPushNotification = (room: string, message: string, fcmTokens: { [room: string]: string[] }) => {
 // Get the FCM tokens for the room
  const tokens = fcmTokens[room];
    if (!tokens[0]) {
      console.log('No FCM tokens for room:', room);
      return;
    }

    // Create the notification message
    const notificationMessage = {
      notification: {
        title: `Room Notification`,
        body: message,
      },
      tokens: tokens,
    };

    // Send push notification to all users in the room
    admin.messaging().sendEachForMulticast(notificationMessage)
      .then((response: any) => {
        console.log(`Successfully sent ${response.successCount} notifications`);
      })
      .catch((error: any) => {
        console.error('Error sending notifications:', error);
      });
  };
