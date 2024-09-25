import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import artworkReducer from '../features/artworks/ArtworkSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        artwork: artworkReducer,
    },
});

export default store;