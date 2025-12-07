import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import Register from '../../pages/Auth/Register';
import userReducer from '../../store/userSlice';

// Mock Axios 
jest.mock('../../services/axios');
import axios from '../../services/axios';

describe('Register Integration Tests', () => {
    let navigate;
    let queryClient;
    let store;

    const renderRegister = () => {
        return render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <Register />
                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        );
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        // Navigation
        navigate = jest.fn();
        require('react-router-dom').useNavigate.mockReturnValue(navigate);

        // Fresh QueryClient
        queryClient = new QueryClient({
            defaultOptions: { 
                queries: { retry: false }, 
                mutations: { retry: false } 
            },
            logger: { 
                log: console.log, 
                warn: console.warn, 
                error: () => {} 
            },
        });

        // Fresh Redux store
        store = configureStore({ 
            reducer: { user: userReducer } 
        });

        renderRegister();

        // Wait for form inputs to appear
        await screen.findByPlaceholderText('John Doe');
    });

    it('Successful register redirect', async () => {
        const user = userEvent.setup();

        const mockResponse = {
            data: {
                data: {
                    user: { 
                        id: 1, 
                        email: 'test@example.com', 
                        fullname: 'John Doe', 
                        role: 'user' 
                    },
                    accessToken: 'mock-token',
                },
            },
        };

        // Mock the axios call
        axios.post.mockResolvedValueOnce(mockResponse);

        // Fill form
        await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
        await user.type(screen.getByPlaceholderText('john@example.com'), 'test@example.com');
        await user.type(screen.getAllByPlaceholderText('••••••••')[0], 'Password123!');
        await user.type(screen.getAllByPlaceholderText('••••••••')[1], 'Password123!');
        
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        // Wait for mutation to complete and state to update
        await waitFor(
            () => {
                const state = store.getState();
                expect(state.user.user).not.toBeNull();
            },
            { timeout: 3000 }
        );

        // Verify axios was called correctly
        expect(axios.post).toHaveBeenCalledWith(
            '/auth/register',
            {
                fullname: 'John Doe',
                email: 'test@example.com',
                password: 'Password123!',
            },
            { withCredentials: true }
        );

        // Verify toast
        expect(toast.success).toHaveBeenCalledWith('Register successfully!');

        // Verify Redux state
        const state = store.getState();
        expect(state.user.user).toEqual({
            id: 1,
            email: 'test@example.com',
            fullname: 'John Doe',
            role: 'user',
        });
        expect(state.user.accessToken).toBe('mock-token');

        // Verify navigation
        expect(navigate).toHaveBeenCalledWith('/products', { replace: true });
    });

    it('Backend field errors', async () => {
        const user = userEvent.setup();

        // Create error object with response
        const errorResponse = new Error('Validation failed');
        errorResponse.response = {
            data: {
                errors: { 
                    email: 'Email already in use', 
                },
            },
        };

        axios.post.mockRejectedValueOnce(errorResponse);

        // Fill form with valid data (backend will reject it)
        await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
        await user.type(screen.getByPlaceholderText('john@example.com'), 'test@example.com');
        await user.type(screen.getAllByPlaceholderText('••••••••')[0], 'Password123!');
        await user.type(screen.getAllByPlaceholderText('••••••••')[1], 'Password123!');
        
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        // Wait for error toast
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Register failed!');
        });

        // Wait for field errors to appear
        await waitFor(() => {
            expect(screen.getByText('Email already in use')).toBeInTheDocument();
        });

        // Redux state should not update
        const state = store.getState();
        expect(state.user.user).toBeNull();
        
        // Should not navigate
        expect(navigate).not.toHaveBeenCalled();
    });

    it('Backend general error', async () => {
        const user = userEvent.setup();

        const errorResponse = new Error('Server error');
        errorResponse.response = { 
            data: { message: 'Something went wrong' } 
        };
        
        axios.post.mockRejectedValueOnce(errorResponse);

        await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
        await user.type(screen.getByPlaceholderText('john@example.com'), 'test@example.com');
        await user.type(screen.getAllByPlaceholderText('••••••••')[0], 'Password123!');
        await user.type(screen.getAllByPlaceholderText('••••••••')[1], 'Password123!');
        
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        // Wait for error toast
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Register failed!');
        });

        // Check for the backend error message in the UI
        await waitFor(() => {
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });

        const state = store.getState();
        expect(state.user.user).toBeNull();
        
        // Should not navigate
        expect(navigate).not.toHaveBeenCalled();
    });

    it('Network error test', async () => {
        const user = userEvent.setup();

        // Network error without response property
        const networkError = new Error('Network Error');
        
        axios.post.mockRejectedValueOnce(networkError);

        await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
        await user.type(screen.getByPlaceholderText('john@example.com'), 'test@example.com');
        await user.type(screen.getAllByPlaceholderText('••••••••')[0], 'Password123!');
        await user.type(screen.getAllByPlaceholderText('••••••••')[1], 'Password123!');
        
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        // Wait for error toast
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Register failed!');
        });

        // Check for network error message in the UI
        await waitFor(() => {
            expect(screen.getByText('Network error or server not reachable')).toBeInTheDocument();
        });

        const state = store.getState();
        expect(state.user.user).toBeNull();
        
        // Should not navigate
        expect(navigate).not.toHaveBeenCalled();
    });

    it('Vérifie que le cookie withCredentials est envoyé dans la requête', async () => {
        const user = userEvent.setup();

        const mockResponse = {
            data: {
                data: {
                    user: { 
                        id: 1, 
                        email: 'test@example.com', 
                        fullname: 'John Doe', 
                        role: 'user' 
                    },
                    accessToken: 'token',
                },
            },
        };

        axios.post.mockResolvedValueOnce(mockResponse);

        await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe');
        await user.type(screen.getByPlaceholderText('john@example.com'), 'test@example.com');
        await user.type(screen.getAllByPlaceholderText('••••••••')[0], 'Password123!');
        await user.type(screen.getAllByPlaceholderText('••••••••')[1], 'Password123!');
        
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                '/auth/register', 
                expect.any(Object), 
                { withCredentials: true }
            );
        });
    });
});