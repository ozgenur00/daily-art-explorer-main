// src/components/NotFound.js
import React from "react";
import { Link } from 'react-router-dom';
import '../../styles/common/NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-heading">404 - Not Found</h1>
                <p className="not-found-text">Oops! The page you're looking for doesn't exist.</p>
                <Link to="/" className="go-back-link">Take Me Back Home</Link>
            </div>
        </div>
    )
}

export default NotFound;