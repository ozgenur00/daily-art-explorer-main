// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { registerUser, loginUser, updateUser, deleteUser } from './authThunks';

let user = null;
let token = null;
try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    user = storedUser ? JSON.parse(storedUser) : null;
    token = storedToken ? storedToken : null;
} catch (error) {
    console.error('Error parsing user or token from localStorage:', error);
    user = null;
    token = null;
}

const initialState = {
    user: user,
    token: token,
    status: 'idle',
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      logout: (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      },
      setToken: (state, action) => {
        state.token = action.payload;
      },
      setUser: (state, action) => {
        state.user = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(registerUser.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('token', action.payload.token);
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || 'Failed to register';
        })
        .addCase(loginUser.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('token', action.payload.token);
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.user = action.payload;
          localStorage.setItem('user', JSON.stringify(action.payload));
        })
        .addCase(updateUser.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        })
        .addCase(deleteUser.fulfilled, (state) => {
          state.status = 'succeeded';
          state.user = null;
          state.token = null;
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        })
        .addCase(deleteUser.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        });
    },
  });
  

export const { logout, setToken, setUser } = authSlice.actions;

export default authSlice.reducer;
