import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';
import './Chat.css';
import { useNavigate } from 'react-router-dom';

const Chat = ({ token }) => {
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [inRoom, setInRoom] = useState(false);
    const navigate = useNavigate();
    const username = localStorage.getItem("username")

  const socket = useRef(null);

  useEffect(() => {
    // Initialize the socket
    socket.current = io('http://20.0.0.34:3003', { query: { token, username } });

    socket.current.on('connect', () => {
      console.log('Connected to server');
      socket.current.emit('register', username);
    });

    socket.current.on('message', (msg) => {
      console.log('Message received:', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up socket connections
    return () => {
      socket.current.disconnect();
    };
  }, [token, username]);

  const joinRoom = () => {
    if (room) {
      socket.current.emit('join', room);
      setMessages([]); // Clear previous messages
      setInRoom(true);
      console.log(`Joined room: ${room}`);
    }
  };

  const sendMessage = () => {
    if (room && message) {
      const newMessage = { room, msg: message };
      socket.current.emit('message', newMessage);
        setMessage(''); // Clear input after sending
        console.log(`Sent message: ${message} to room: ${room}`);
    }
  };

  const leaveRoom = () => {
    if (room) {
      socket.current.emit('leave', room);
    }
    resetChat();
  };

  const logout = () => {
    // Check if the user is in a room and leave
    if (inRoom) {
        socket.current.emit('leave', room);
        localStorage.clear()
    }

    // Disconnect the socket to fully logout the user from the chat server
    if (socket.current) {
        socket.current.disconnect();
        localStorage.clear()
      console.log('User disconnected from server');
    }

    // Reset chat state and redirect to login page
    resetChat();
    navigate('/login');
  };

  const resetChat = () => {
    setRoom('');
    setInRoom(false);
    setMessages([]);
  };

  if (!inRoom) {
    return (
      <div className="container-chat">
        <h1>Join a Room</h1>
        <input
          type="number"
          className="message-input"
          placeholder="Enter Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="container-chat">
      <div className="room-header">
        <h1>Room {room}</h1>
        <button onClick={leaveRoom}>Leave Room</button>
      </div>

      <div className="message-box">
        <ul className="messages">
          {messages.map((msg, index) => (
            <li key={index} className="message-item">
              <strong>{msg.from}</strong> at {msg.timestamp}: {msg.msg}
            </li>
          ))}
        </ul>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

Chat.propTypes = {
  token: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default Chat;
