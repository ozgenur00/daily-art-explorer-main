import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../../components/layout/Navbar';
import { logout } from '../../../features/auth/authSlice';

// Mock the necessary hooks and actions
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../features/auth/authSlice', () => ({
  logout: jest.fn(),
}));

describe('Navbar Component', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    // Mock the Redux state for a logged-in user
    useSelector.mockImplementation((selector) => 
      selector({
        auth: {
          token: 'sampleToken',
          user: { username: 'testuser' },
        }
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Navbar with user logged in', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('Daily Art Explorer')).toBeInTheDocument();
    expect(screen.getByText('Browse Artworks')).toBeInTheDocument();

    const userElement = screen.getByTestId('navbar-user');

    expect(within(userElement).getByText(/testuser/)).toBeInTheDocument();
  });

  test('dropdown toggles on click', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    fireEvent.click(screen.getByTestId('navbar-user'));

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    fireEvent.click(document.body);
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  test('dispatches logout action and navigates on logout click', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    fireEvent.click(screen.getByTestId('navbar-user'));

    fireEvent.click(screen.getByText('Logout'));

    expect(dispatch).toHaveBeenCalledWith(logout());
  });

  test('renders Navbar without user when not logged in', () => {
    useSelector.mockImplementation((selector) => 
      selector({
        auth: {
          token: null,
          user: null,
        }
      })
    );

    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('Daily Art Explorer')).toBeInTheDocument();
    expect(screen.queryByText('Browse Artworks')).not.toBeInTheDocument();  // Check that the link is not rendered
    expect(screen.queryByTestId('navbar-user')).not.toBeInTheDocument();   // Username div shouldn't exist
  });
});
