import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/loginPage/Login';
import Chat from './components/chatPage/Chat';

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
 

  

  const handleLogin = (userToken) => {
    setToken(userToken);
    
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/chat" element={<Chat token={token}  />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
