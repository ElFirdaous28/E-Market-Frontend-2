import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import OrdersManager from '../../../pages/seller/OrdersManager';
import orderReducer from '../../../store/orderSlice';
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

describe('SellerOrders Integration Test', () => {
    let queryClient;
    let store;
    let mockAxios;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        });

        store = configureStore({
            reducer: {
                orders: orderReducer,
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
            patch: jest.fn(),
        };

        jest.spyOn(useAxiosModule, 'useAxios').mockReturnValue(mockAxios);
        jest.spyOn(useAuthModule, 'useAuth').mockReturnValue({
            user: { _id: 'seller1', email: 'seller@test.com', role: 'seller' },
            accessToken: 'fake-token',
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Given un seller, When il consulte les commandes, Then seules les commandes contenant ses produits sont affichées', async () => {
        // Orders containing only the seller's products
        const sellerOrders = [
            {
                _id: 'order123',
                userId: { _id: 'buyer1', fullname: 'Jean Dupont' },
                items: [
                    { productId: { _id: 'prod1', title: 'iPhone 14' }, quantity: 1, price: 899 },
                    { productId: { _id: 'prod2', title: 'iPad Pro' }, quantity: 1, price: 1099 },
                ],
                sellerTotal: 1998,
                status: 'pending',
                createdAt: '2025-11-20T10:00:00Z',
            },
            {
                _id: 'order456',
                userId: { _id: 'buyer2', fullname: 'Marie Martin' },
                items: [
                    { productId: { _id: 'prod3', title: 'MacBook Pro' }, quantity: 1, price: 2499 },
                ],
                sellerTotal: 2499,
                status: 'shipped',
                createdAt: '2025-11-21T14:30:00Z',
            },
            {
                _id: 'order789',
                userId: { _id: 'buyer3', fullname: 'Pierre Dubois' },
                items: [
                    { productId: { _id: 'prod4', title: 'AirPods Pro' }, quantity: 2, price: 249 },
                ],
                sellerTotal: 498,
                status: 'delivered',
                createdAt: '2025-11-19T09:15:00Z',
            },
        ];

        // Mock GET /orders/seller/:sellerId to return only this seller's orders
        mockAxios.get.mockResolvedValueOnce({
            data: {
                orders: sellerOrders,
            },
        });

        const wrapper = ({ children }) => (
            <BrowserRouter>
                <Provider store={store}>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </Provider>
            </BrowserRouter>
        );

        render(<OrdersManager />, { wrapper });

        // Verify API was called with correct seller ID
        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalledWith('/orders/seller/seller1');
        });

        // Verify all 3 seller orders are displayed
        await waitFor(() => {
            expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
            expect(screen.getByText('Marie Martin')).toBeInTheDocument();
            expect(screen.getByText('Pierre Dubois')).toBeInTheDocument();
        });

        // Verify products from seller's orders are shown
        expect(screen.getByText(/iPhone 14/i)).toBeInTheDocument();
        expect(screen.getByText(/MacBook Pro/i)).toBeInTheDocument();
        expect(screen.getByText(/AirPods Pro/i)).toBeInTheDocument();

        // Verify sellerTotal amounts are displayed correctly
        expect(screen.getByText('1998.00 €')).toBeInTheDocument();
        expect(screen.getByText('2499.00 €')).toBeInTheDocument();
        expect(screen.getByText('498.00 €')).toBeInTheDocument();

        // Verify exactly 3 orders are displayed in the table
        const rows = screen.getAllByRole('row');
        // 1 header row + 3 data rows = 4 total rows
        expect(rows).toHaveLength(4);

        // Verify Redux store was updated with seller orders
        await waitFor(() => {
            const state = store.getState();
            expect(state.orders.sellerOrders).toHaveLength(3);
            expect(state.orders.sellerOrders[0]._id).toBe('order123');
            expect(state.orders.sellerOrders[1]._id).toBe('order456');
            expect(state.orders.sellerOrders[2]._id).toBe('order789');
        });
    });
});
