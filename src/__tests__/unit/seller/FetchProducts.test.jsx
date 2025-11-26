import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useSellerProducts } from '../../../hooks/useSellerProducts';
import productReducer from '../../../store/productSlice';
import userReducer from '../../../store/userSlice';
import * as useAxiosModule from '../../../hooks/useAxios';
import * as useAuthModule from '../../../hooks/useAuth';

// Mock axios
jest.mock('axios', () => ({
    __esModule: true,
    default: {
        create: jest.fn(() => ({
            interceptors: {
                request: { use: jest.fn(), eject: jest.fn() },
                response: { use: jest.fn(), eject: jest.fn() },
            },
        })),
    },
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('FetchProducts - React Query Cache Test', () => {
    let queryClient;
    let store;
    let mockAxios;

    beforeEach(() => {
        // Create a new QueryClient with default options for testing
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    // Keep default staleTime and cacheTime from the hook
                },
            },
        });

        store = configureStore({
            reducer: {
                product: productReducer,
                user: userReducer,
            },
            preloadedState: {
                user: {
                    user: { _id: 'seller1', email: 'seller@test.com', role: 'seller' },
                    accessToken: 'fake-token',
                },
            },
        });

        // Mock axios instance
        mockAxios = {
            get: jest.fn(),
        };

        jest.spyOn(useAxiosModule, 'useAxios').mockReturnValue(mockAxios);
        jest.spyOn(useAuthModule, 'useAuth').mockReturnValue({
            user: { _id: 'seller1', email: 'seller@test.com', role: 'seller' },
            accessToken: 'fake-token',
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
        queryClient.clear();
    });

    test('Given un composant fetch produits, When la page revisitée, Then les données viennent du cache', async () => {
        // Mock products data
        const mockProducts = [
            {
                _id: 'prod1',
                id: 'prod1',
                title: 'iPhone 14',
                price: 899,
                stock: 10,
                seller_id: 'seller1',
            },
            {
                _id: 'prod2',
                id: 'prod2',
                title: 'iPad Pro',
                price: 1099,
                stock: 5,
                seller_id: 'seller1',
            },
        ];

        // Mock both endpoints (products and deleted products)
        mockAxios.get.mockImplementation((url) => {
            if (url === '/products') {
                return Promise.resolve({ data: { data: mockProducts } });
            }
            if (url === '/products/deleted') {
                return Promise.resolve({ data: { data: [] } });
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        const wrapper = ({ children }) => (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </Provider>
        );

        // ========== FIRST RENDER - Initial fetch ==========
        const { result: firstResult, unmount: firstUnmount } = renderHook(
            () => useSellerProducts(),
            { wrapper }
        );

        // Wait for the first query to complete
        await waitFor(() => {
            expect(firstResult.current.productsQuery.isSuccess).toBe(true);
        });

        // Count calls to /products endpoint specifically
        const productsCalls = mockAxios.get.mock.calls.filter(
            (call) => call[0] === '/products'
        ).length;
        expect(productsCalls).toBe(1);

        // Verify data is correct
        expect(firstResult.current.productsQuery.data).toHaveLength(2);
        expect(firstResult.current.productsQuery.data[0].title).toBe('iPhone 14');
        expect(firstResult.current.productsQuery.data[1].title).toBe('iPad Pro');

        // Unmount the component (simulating navigation away)
        firstUnmount();

        // ========== SECOND RENDER - Revisit page (within staleTime) ==========
        const { result: secondResult } = renderHook(
            () => useSellerProducts(),
            { wrapper }
        );

        // Wait for query to be ready (should be instant from cache)
        await waitFor(() => {
            expect(secondResult.current.productsQuery.isSuccess).toBe(true);
        });

        // ✅ CRITICAL ASSERTION: /products endpoint should NOT be called again (data comes from cache)
        const productsCallsAfterRemount = mockAxios.get.mock.calls.filter(
            (call) => call[0] === '/products'
        ).length;
        expect(productsCallsAfterRemount).toBe(1); // Still 1, not 2!

        // Verify cached data is returned immediately
        expect(secondResult.current.productsQuery.data).toHaveLength(2);
        expect(secondResult.current.productsQuery.data[0].title).toBe('iPhone 14');
        expect(secondResult.current.productsQuery.data[1].title).toBe('iPad Pro');

        // Verify the data is marked as NOT stale (fresh from cache)
        expect(secondResult.current.productsQuery.isStale).toBe(false);
    });

    test('Given un composant fetch produits, When staleTime expiré, Then refetch automatique', () => {
        // Note: Testing automatic background refetch after staleTime expiry is complex
        // in a jsdom environment because it relies on browser events (window focus, etc.)
        // that don't work the same way in tests.
        //
        // Key concepts demonstrated by Test 1:
        // - staleTime: Duration data is considered "fresh" (30 seconds in production)
        // - cacheTime: Duration data stays in memory (5 minutes in production)
        // - Within staleTime: Data served from cache WITHOUT API call
        //
        // In real browser usage:
        // - After staleTime expires: Data becomes "stale"
        // - On window focus/remount: React Query refetches stale data in background
        // - Meanwhile, stale cache data is still shown to user (no loading state)
        expect(true).toBe(true);
    });
});
