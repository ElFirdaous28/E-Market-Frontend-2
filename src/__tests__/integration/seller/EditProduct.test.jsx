import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import EditProduct from '../../../pages/seller/EditProduct';
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

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'prod123' }),
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
    categories: [
      { _id: 'cat1', name: 'Electronics' },
      { _id: 'cat2', name: 'Phones' },
    ],
    loading: false,
  }),
}));

describe('EditProduct Integration Test', () => {
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
      put: jest.fn(),
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

  test("Given un seller, When il modifie un produit existant, Then l'API est appelée et produit mis à jour", async () => {
    const user = userEvent.setup();

    // Existing product data
    const existingProduct = {
      _id: 'prod123',
      title: 'iPhone 14',
      price: 899,
      stock: 10,
      description: 'Old description',
      categories: ['cat1'],
      seller_id: 'seller1',
      primaryImage: 'https://example.com/old-image.jpg',
      secondaryImages: [],
      published: true,
    };

    // Mock GET /products to return existing product
    mockAxios.get.mockResolvedValueOnce({
      data: {
        data: [existingProduct],
      },
    });

    // Updated product data returned by API
    const updatedProduct = {
      ...existingProduct,
      title: 'iPhone 15 Pro',
      price: 1099,
      stock: 15,
      description: 'Updated description',
    };

    // Mock PUT /products/:id to return updated product
    mockAxios.put.mockResolvedValueOnce({
      data: {
        data: updatedProduct,
      },
    });

    const wrapper = ({ children }) => (
      <BrowserRouter>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Provider>
      </BrowserRouter>
    );

    render(<EditProduct />, { wrapper });

    // Wait for the product to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('iPhone 14')).toBeInTheDocument();
    });

    // Verify initial values are populated
    expect(screen.getByDisplayValue('iPhone 14')).toBeInTheDocument();
    expect(screen.getByDisplayValue('899')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();

    // Update the form fields using placeholder text
    const titleInput = screen.getByPlaceholderText(/iPhone 15 Pro Max/i);
    const priceInput = screen.getByPlaceholderText('0.00');
    const stockInput = screen.getByPlaceholderText('0');
    const descriptionInput = screen.getByPlaceholderText(/Décrivez votre produit/i);

    await user.clear(titleInput);
    await user.type(titleInput, 'iPhone 15 Pro');

    await user.clear(priceInput);
    await user.type(priceInput, '1099');

    await user.clear(stockInput);
    await user.type(stockInput, '15');

    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated description');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Enregistrer les modifications/i });
    await user.click(submitButton);

    // Verify API was called with correct data
    await waitFor(() => {
      expect(mockAxios.put).toHaveBeenCalledWith('/products/prod123', expect.any(FormData), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    });

    // Verify the FormData contains updated values
    const formDataCall = mockAxios.put.mock.calls[0][1];
    expect(formDataCall.get('title')).toBe('iPhone 15 Pro');
    expect(formDataCall.get('price')).toBe('1099');
    expect(formDataCall.get('stock')).toBe('15');
    expect(formDataCall.get('description')).toBe('Updated description');

    // Verify Redux store was updated
    await waitFor(() => {
      const state = store.getState();
      const updatedInStore = state.product.sellerProducts.find((p) => p._id === 'prod123');
      expect(updatedInStore.title).toBe('iPhone 15 Pro');
      expect(updatedInStore.price).toBe(1099);
    });

    // Verify navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/seller/products');
  });
});
