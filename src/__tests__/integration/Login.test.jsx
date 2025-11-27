import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import Login from '../../pages/Auth/Login';
import userReducer from '../../store/userSlice';

// 1. Activate the manual mock
jest.mock('../../services/axios');
// 2. Import the mock so we can control it (mockImplementation)
import axios from '../../services/axios';

describe('Login Integration Tests - User Role Navigation', () => {
  let navigate;
  let queryClient;
  let store;

  const renderLogin = () => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    );
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Setup Navigation Spy
    navigate = jest.fn();
    // We override the default mock from setupTests for this specific test suite
    require('react-router-dom').useNavigate.mockReturnValue(navigate);

    // Fresh QueryClient
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
      logger: {
        log: console.log,
        warn: console.warn,
        error: () => { },
      },
    });

    // Fresh Store
    store = configureStore({
      reducer: { user: userReducer },
    });
    renderLogin();
    await screen.findByPlaceholderText('jhon@example.com');
  });

  describe('Given un user valide, When il soumet le formulaire, Then redirection vers son dashboard', () => {
    it("Redirection vers /products pour un user avec role 'user'", async () => {
      const user = userEvent.setup();

      // Mock successful login response for regular user
      const mockResponse = {
        data: {
          data: {
            user: {
              id: 1,
              email: 'user@example.com',
              fullname: 'John Doe',
              role: 'user',
            },
            accessToken: 'mock-access-token',
          },
        },
      };

      axios.post.mockImplementation((url) => {
        if (url === '/auth/login') {
          return Promise.resolve(mockResponse);
        }
        return Promise.reject(new Error('Unexpected API call'));
      });

      // Fill in the form
      const emailInput = screen.getByPlaceholderText('jhon@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');

      await user.type(emailInput, 'user@example.com');
      await user.type(passwordInput, 'Password123!');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Wait for all async operations to complete
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          '/auth/login',
          {
            email: 'user@example.com',
            password: 'Password123!',
          },
          { withCredentials: true }
        );
      });

      // Wait for toast to be called
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Logged in successfully!');
      });

      // Verify Redux state updated
      await waitFor(() => {
        const state = store.getState();
        expect(state.user.user).toEqual({
          id: 1,
          email: 'user@example.com',
          fullname: 'John Doe',
          role: 'user',
        });
        expect(state.user.accessToken).toBe('mock-access-token');
      });

      // Verify navigation to products page (user dashboard)
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('/products', { replace: true });
      });
    });

    it("Redirection vers /admin/dashboard pour un user avec role 'admin'", async () => {
      const user = userEvent.setup();

      const mockResponse = {
        data: {
          data: {
            user: {
              id: 2,
              email: 'admin@example.com',
              fullname: 'Admin User',
              role: 'admin',
            },
            accessToken: 'mock-admin-token',
          },
        },
      };

      axios.post.mockImplementation((url) => {
        if (url === '/auth/login') {
          return Promise.resolve(mockResponse);
        }
        return Promise.reject(new Error('Unexpected API call'));
      });

      const emailInput = screen.getByPlaceholderText('jhon@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');

      await user.type(emailInput, 'admin@example.com');
      await user.type(passwordInput, 'AdminPass123!');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      // Verify success toast
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Logged in successfully!');
      });

      // Verify Redux state
      await waitFor(() => {
        const state = store.getState();
        expect(state.user.user.role).toBe('admin');
      });

      // Verify navigation to admin dashboard
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('/admin/dashboard', { replace: true });
      });
    });

    it("Redirection vers /seller/dashboard pour un user avec role 'seller'", async () => {
      const user = userEvent.setup();

      const mockResponse = {
        data: {
          data: {
            user: {
              id: 3,
              email: 'seller@example.com',
              fullname: 'Seller User',
              role: 'seller',
            },
            accessToken: 'mock-seller-token',
          },
        },
      };

      axios.post.mockImplementation((url) => {
        if (url === '/auth/login') {
          return Promise.resolve(mockResponse);
        }
        return Promise.reject(new Error('Unexpected API call'));
      });

      const emailInput = screen.getByPlaceholderText('jhon@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');

      await user.type(emailInput, 'seller@example.com');
      await user.type(passwordInput, 'SellerPass123!');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      // Verify success toast
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Logged in successfully!');
      });

      // Verify Redux state
      await waitFor(() => {
        const state = store.getState();
        expect(state.user.user.role).toBe('seller');
      });

      // Verify navigation to seller dashboard
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('/seller/overview', { replace: true });
      });
    });

    it('Given des credentials invalides, When il soumet le formulaire, Then affiche une erreur et ne navigue pas', async () => {
      const user = userEvent.setup();

      // Create a proper error object with response
      const errorResponse = new Error('Invalid credentials');
      errorResponse.response = {
        data: {
          message: 'Invalid email or password',
        },
      };

      axios.post.mockImplementation((url) => {
        if (url === '/auth/login') {
          return Promise.reject(errorResponse);
        }
        return Promise.reject(new Error('Unexpected API call'));
      });

      const emailInput = screen.getByPlaceholderText('jhon@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');

      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'WrongPassword!');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Wait for error toast
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Login failed!');
      });

      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      });

      // Verify Redux state not updated
      const state = store.getState();
      expect(state.user.user).toBeNull();
      expect(state.user.accessToken).toBeNull();

      // Should not navigate
      expect(navigate).not.toHaveBeenCalled();
    });

    it('Vérifie que le cookie withCredentials est envoyé dans la requête', async () => {
      const user = userEvent.setup();

      const mockResponse = {
        data: {
          data: {
            user: { id: 1, email: 'user@example.com', role: 'user', fullname: 'Test User' },
            accessToken: 'token',
          },
        },
      };

      axios.post.mockImplementation((url) => {
        if (url === '/auth/login') {
          return Promise.resolve(mockResponse);
        }
        return Promise.reject(new Error('Unexpected API call'));
      });

      const emailInput = screen.getByPlaceholderText('jhon@example.com');
      const passwordInput = screen.getByPlaceholderText('••••••••');

      await user.type(emailInput, 'user@example.com');
      await user.type(passwordInput, 'Password123!');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/auth/login', expect.any(Object), {
          withCredentials: true,
        });
      });
    });
  });
});
