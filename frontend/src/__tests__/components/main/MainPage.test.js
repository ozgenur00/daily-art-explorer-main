import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainPage from '../../../components/main/MainPage';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe('MainPage Component', () => {
  let navigate;

  beforeEach(() => {
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid contamination
  });

  test('renders login and sign-up buttons when unauthenticated', () => {
    useSelector.mockReturnValue(null);

    render(<MainPage />);


    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();


    expect(navigate).not.toHaveBeenCalled();
  });

  test('redirects to /artwork when authenticated', () => {
    useSelector.mockReturnValue('valid-token');

    render(<MainPage />);

    expect(navigate).toHaveBeenCalledWith('/artwork');
  });
});
