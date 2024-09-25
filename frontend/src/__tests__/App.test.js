import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../app/store';
import App from '../App';

test('renders MainPage when at root route', async () => {
  await act(async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  expect(screen.getByText(/Welcome to the Daily Art Explorer/i)).toBeInTheDocument();
});

test('renders RegisterForm when at /register route', async () => {
  await act(async () => {
    window.history.pushState({}, 'Test page', '/register');
  
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
});

test('renders LoginForm when at /login route', async () => {
  await act(async () => {
    window.history.pushState({}, 'Test page', '/login');
  
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
});

test('renders Navbar on /artworks route', async () => {
  await act(async () => {
    window.history.pushState({}, 'Test page', '/artworks');

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  expect(screen.getByRole('navigation')).toBeInTheDocument();
});

test('does not render Navbar on root route', async () => {
  await act(async () => {
    window.history.pushState({}, 'Test page', '/');

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
});

test('dispatches setToken and setUser on mount if localStorage contains token and user', async () => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === 'token') return 'dummy-token';
    if (key === 'user') return JSON.stringify({ id: 1, name: 'Test User' });
    return null;
  });

  await act(async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  expect(localStorage.getItem).toHaveBeenCalledWith('token');
  expect(localStorage.getItem).toHaveBeenCalledWith('user');
});
