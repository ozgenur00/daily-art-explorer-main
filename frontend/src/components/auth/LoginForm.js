import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from '../../features/auth/authThunks';
import '../../styles/auth/LoginPage.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState({});
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation checks
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!password.trim()) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      setValidationError(errors);
      return;
    }

    setValidationError({});

    dispatch(loginUser({ username, password }))
      .unwrap()
      .then(() => {
        navigate('/artwork');  
      })
      .catch((err) => {
        console.error('Login error:', err);
      });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"  
        />
        {validationError.username && <p className="error-message">{validationError.username}</p>}


        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password" 
        />
        {validationError.password && <p className="error-message">{validationError.password}</p>}

        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in...' : 'Login'}  
        </button>


        {error && <p className="server-error-message">{error}</p>} 

        <div className="signup-link">
          <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
