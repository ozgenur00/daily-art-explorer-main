import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/main/MainPage.css';

const MainPage = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/artwork');
    }
  }, [token, navigate]);

  return (
    <div className="page-container">
      <div className="background-image"></div>
      <div className="content-overlay">
        <h1 className="title">Welcome to the Daily Art Explorer</h1>
        <p className="subtitle">Please register or log in to continue.</p>
        <div className="button-container">
          <Link to="/login" className="styled-button">Login</Link>
          <Link to="/register" className="styled-button">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;