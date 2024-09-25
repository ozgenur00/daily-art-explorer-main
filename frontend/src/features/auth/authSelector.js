// src/features/auth/authSelectors.js
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
