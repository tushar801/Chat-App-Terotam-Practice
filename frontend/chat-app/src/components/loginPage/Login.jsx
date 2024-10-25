import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Login.css';

const Login = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://20.0.0.34:3003/api/login',
        { 
          identifier, 
          password 
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if ([200, 201].includes(response.status)) {
        const { username } = response.data;
        localStorage.setItem("username",username)
        // onLogin(token, username);  // Proceed with login
        navigate('/chat');
      } else {
        setError(response.data.message || 'Username or Password is not correct.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Username or Password is not correct.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email, Mobile, or Unique ID"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <div className='error'>{error}</div>}
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
