import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from '../../features/auth/authThunks';
import '../../styles/auth/RegisterPage.css';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
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
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            errors.email = 'Invalid email format';
        }
    
        // Password strength validation (min length, contains a number)
        if (!password.trim()) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        } else if (!/\d/.test(password)) {
            errors.password = 'Password must contain at least one number';
        }
    
        if (Object.keys(errors).length > 0) {
            setValidationError(errors);
            return;
        }
    
        setValidationError({});
    
        dispatch(registerUser({ username, email, password })).unwrap()
            .then(() => {
                navigate('/artwork'); 
            })
            .catch((err) => {
                console.error('Registration error:', err); 
            });
    };
    

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                
                <input
                    type='text'
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username" 
                />
                {validationError.username && <p className="error-message">{validationError.username}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"  
                />
                {validationError.email && <p className="error-message">{validationError.email}</p>}
                
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password" 
                />
                {validationError.password && <p className="error-message">{validationError.password}</p>}
                
                <button type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Registering...' : 'Register'} 
                </button>

                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default RegisterForm;
