import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProductsManager from '../../../pages/seller/ProductsManager';
import productReducer from '../../../store/productSlice';
import userReducer from '../../../store/userSlice';
import * as useAxiosModule from '../../../hooks/useAxios';
import * as useAuthModule from '../../../hooks/useAuth';
import { toast } from 'react-toastify';

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

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

// Mock useCategories
jest.mock('../../../hooks/useCategories', () => ({
    useCategories: () => ({
        categories: [],
        loading: false,
    }),
}));

describe('DeleteProduct Integration Test', () => {
    let queryClient;
    let store;
    let mockAxios;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
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
            delete: jest.fn(),
        };

        jest.spyOn(useAxiosModule, 'useAxios').mockReturnValue(mockAxios);
        jest.spyOn(useAuthModule, 'useAuth').mockReturnValue({
            user: { _id: 'seller1', email: 'seller@test.com', role: 'seller' },
            accessToken: 'fake-token',
        });

        mockNavigate.mockClear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Given un seller, When il supprime un produit, Then l\'API est appelée et produit supprimé', async () => {
        const user = userEvent.setup();

        // Mock products data
        const products = [
            {
                _id: 'prod123',
                id: 'prod123',
                title: 'iPhone 14',
                price: 899,
                stock: 10,
                description: 'Test product',
                categories: [],
                seller_id: 'seller1',
                primaryImage: '/images/iphone.jpg',
                secondaryImages: [],
                published: true,
            },
            {
                _id: 'prod456',
                id: 'prod456',
                title: 'Samsung Galaxy',
                price: 799,
                stock: 5,
                description: 'Another product',
                categories: [],
                seller_id: 'seller1',
                primaryImage: '/images/samsung.jpg',
                secondaryImages: [],
                published: false,
            },
        ];

        // Mock GET /products to return initial products
        mockAxios.get.mockResolvedValue({
            data: {
                data: products,
            },
        });

        // Mock DELETE /products/:id/soft to succeed
        mockAxios.delete.mockResolvedValueOnce({
            data: {
                message: 'Product soft deleted successfully',
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

        render(<ProductsManager />, { wrapper });

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getByText('iPhone 14')).toBeInTheDocument();
        });

        // Verify both products are displayed
        expect(screen.getByText('iPhone 14')).toBeInTheDocument();
        expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();

        // Verify initial Redux state has 2 products
        let state = store.getState();
        expect(state.product.sellerProducts.length).toBe(2);

        // Find and click the delete button for iPhone 14
        const deleteButtons = screen.getAllByRole('button', { name: /Supprimer/i });
        const firstDeleteButton = deleteButtons[0];

        await user.click(firstDeleteButton);

        // Verify API was called with correct endpoint
        await waitFor(() => {
            expect(mockAxios.delete).toHaveBeenCalledWith('/products/prod123/soft');
        });

        // Verify the delete API was called exactly once
        expect(mockAxios.delete).toHaveBeenCalledTimes(1);

        // Verify success toast was called (confirms mutation completed successfully)
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Produit supprimé');
        });
    });
});
