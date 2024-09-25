// src/app/store.test.js
import { configureStore } from '@reduxjs/toolkit';
import store from '../app/store.js';
import authReducer from '../features/auth/authSlice';
import artworkReducer from '../features/artworks/ArtworkSlice';

describe('Redux Store', () => {
    it('should initialize with the correct reducers', () => {
        const testStore = configureStore({
            reducer: {
                auth: authReducer,
                artwork: artworkReducer,
            },
        });

        expect(store.getState()).toEqual(testStore.getState());
    });

    it('should have the auth and artwork slices in the store', () => {
        const state = store.getState();

        expect(state.auth).toBeDefined();
        expect(state.artwork).toBeDefined();
    });
});
