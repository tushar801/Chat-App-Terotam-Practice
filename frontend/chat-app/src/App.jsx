import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/loginPage/Login';
import Chat from './components/chatPage/Chat';

const App = () => {
  
   return (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;