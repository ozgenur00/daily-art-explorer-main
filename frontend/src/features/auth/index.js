// src/features/auth/index.js
import authReducer from './authSlice';
export * from './authThunks';
export * from './authSelectors';
export { logout } from './authSlice';

export default authReducer;
