// src/App.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from './features/auth/authSlice';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import store from './app/store';
import RegisterForm from './components/auth/RegisterForm';
import LoginForm from './components/auth/LoginForm';
import ArtworkDisplay from './components/artworks/ArtworkDisplay';
import MainPage from './components/main/MainPage';
import LikedArtworks from './components/artworks/LikedArtworks';
import SavedArtworks from './components/artworks/SavedArtworks';
import ArtworkListPage from './components/artworks/ArtworkListPage'; 
import Navbar from './components/layout/Navbar';
import FlashMessage from './components/layout/FlashMessage';
import NotFound from './components/common/NotFound';
import ArtworkDetails from './components/artworks/ArtworkDetails';
import AccountSettings from './components/main/AccountSettings';

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      dispatch(setToken(token));
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);


  const showNavbarRoutes = [
    '/artworks',
    '/artwork',
    '/liked-artworks',
    '/saved-artworks',
    '/artwork/:id',
    '/account-settings'
  ];

  const showNavbar = showNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div>
      {showNavbar && <Navbar />}
      <FlashMessage />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/artwork" element={<ArtworkDisplay />} />
        <Route path="/liked-artworks" element={<LikedArtworks />} />
        <Route path="/saved-artworks" element={<SavedArtworks />} />
        <Route path="/artworks" element={<ArtworkListPage />} /> 
        <Route path="*" element={<NotFound />} />
        <Route path="/artwork/:id" element={<ArtworkDetails />} />
        <Route path="/account-settings" element={<AccountSettings />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
