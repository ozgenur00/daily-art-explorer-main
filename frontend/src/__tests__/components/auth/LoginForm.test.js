import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import LoginForm from '../../../components/auth/LoginForm';

// Mock the thunk action
jest.mock('../../../features/auth/authThunks', () => ({
  loginUser: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('LoginForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        status: 'idle',
        error: null,
      },
    });
  });

  it('renders the form fields and login button', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    // Check for input fields and button
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('displays loading text when login is in progress', async () => {
    store = mockStore({
      auth: {
        status: 'loading',
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: /logging in.../i })).toBeInTheDocument();
  });

  it('displays server error when login fails', async () => {
    store = mockStore({
      auth: {
        status: 'idle',
        error: 'Invalid credentials',
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
