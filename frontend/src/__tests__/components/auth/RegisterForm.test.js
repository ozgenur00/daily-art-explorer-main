import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import RegisterForm from '../../../components/auth/RegisterForm';

// Mock the thunk action
jest.mock('../../../features/auth/authThunks', () => ({
  registerUser: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('RegisterForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        status: 'idle',
        error: null,
      },
    });
  });

  it('renders the form fields and register button', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('displays loading text when registration is in progress', async () => {
    store = mockStore({
      auth: {
        status: 'loading',
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: /registering.../i })).toBeInTheDocument();
  });

  it('displays server error when registration fails', async () => {
    store = mockStore({
      auth: {
        status: 'idle',
        error: 'Email already taken',
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterForm />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/email already taken/i)).toBeInTheDocument();
  });
});
