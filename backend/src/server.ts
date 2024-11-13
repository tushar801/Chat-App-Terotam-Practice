import http from 'http';
import app from './app';
import { configureSocket } from './socket';

const PORT = 3003; 

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.io
configureSocket(server);

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
