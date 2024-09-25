// src/features/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Thunk to register a user
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});




// Thunk to login a user
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        const message = error.response?.status === 401
            ? 'Username or password wrong' 
            : error.response?.data?.message || 'Something went wrong';
        console.error('Login error:', message);
        return rejectWithValue(message);
    }
});


//Thunk to update a user
export const updateUser = createAsyncThunk('auth/updateUser', async (userData, {getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
        return rejectWithValue("token is missing");
    }

    try {
        const response = await api.put(`/users/${userData.id}`, userData, {
            headers:{ Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Thunk to delete a user
export const deleteUser = createAsyncThunk('auth/deleteUser', async (userId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
        return rejectWithValue("Token is missing");
    }
    try {
        await api.delete(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return userId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
