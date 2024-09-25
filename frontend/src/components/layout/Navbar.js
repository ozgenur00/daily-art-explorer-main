import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import '../../styles/layout/Navbar.css';

function Navbar() {
    const [dropdownVisible, setDropdownVisible] = useState(false); 
    const token = useSelector((state) => state.auth.token); 
    const user = useSelector((state) => state.auth.user); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleLogout = (event) => {
        event.preventDefault();
        dispatch(logout());
        navigate('/'); 
    };


    const toggleDropdown = (event) => {
        event.stopPropagation();
        setDropdownVisible(!dropdownVisible); 
    };


    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false); 
        }
    };


    useEffect(() => {
        document.addEventListener('click', handleClickOutside); 
        return () => {
            document.removeEventListener('click', handleClickOutside); 
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to={token ? "/artwork" : "/"} className="navbar-logo">
                    Daily Art Explorer
                </Link>
                {token && (
                    <div className="navbar-links">
                        <Link to="/artworks" className="navbar-link">Browse Artworks</Link>
                        <Link to="/liked-artworks" className="navbar-link">Liked Artworks</Link>
                        <Link to="/saved-artworks" className="navbar-link">Saved Artworks</Link>
                    </div>
                )}
            </div>
            {token && user && (
                <div className="navbar-right">
                    <div className="navbar-user" onClick={toggleDropdown} data-testid="navbar-user">
                        {user?.username || 'Guest'} <span className="dropdown-arrow">▼</span>
                    </div>
                    {dropdownVisible && (
                        <div ref={dropdownRef} className="navbar-dropdown">
                            <Link to="/account-settings" className="navbar-dropdown-item">Settings</Link>
                            <Link to="/" onClick={handleLogout} className="navbar-dropdown-item">Logout</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
