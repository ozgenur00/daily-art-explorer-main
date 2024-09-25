import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AccountSettings from '../../../components/main/AccountSettings';
import { deleteUser } from '../../../features/auth/authThunks';


jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../features/auth/authThunks', () => ({
  updateUser: jest.fn(),
  deleteUser: jest.fn(() => Promise.resolve()), 
}));

// Mock window.alert
beforeAll(() => {
  window.alert = jest.fn();
});


describe('AccountSettings Component', () => {
  let dispatch;
  let navigate;

  beforeEach(() => {
    dispatch = jest.fn();
    navigate = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    useNavigate.mockReturnValue(navigate);

    useSelector.mockReturnValue({
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
    });

    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('dispatches deleteUser action and navigates to home after account deletion', async () => {
    render(<AccountSettings />);

    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(deleteUser(1));
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/');
    });
  });

  test('does not dispatch deleteUser action if confirmation is declined', async () => {
    window.confirm = jest.fn(() => false);

    render(<AccountSettings />);

    fireEvent.click(screen.getByRole('button', { name: /delete account/i }));

    await waitFor(() => {
      expect(dispatch).not.toHaveBeenCalledWith(deleteUser(1));
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
