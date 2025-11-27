import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import CouponCreate from '../../../pages/seller/CouponCreate';
import couponReducer from '../../../store/couponSlice';
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

// Mock react-router-dom
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

describe('CreateCoupon Integration Test', () => {
  let queryClient;
  let store;
  let mockAxios;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    store = configureStore({
      reducer: {
        coupon: couponReducer,
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
      post: jest.fn(),
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

  test('Given CouponForm, When un coupon valide est créé, Then il est ajouté au state', async () => {
    const user = userEvent.setup();

    // Mock GET /coupons to return empty list initially
    mockAxios.get.mockResolvedValueOnce({
      data: {
        data: [],
        pagination: { page: 1, pages: 1, total: 0 },
      },
    });

    // New coupon that will be created
    const newCoupon = {
      _id: 'coupon123',
      code: 'SUMMER2025',
      type: 'percentage',
      value: 20,
      minimumPurchase: 50,
      startDate: '2025-11-26T00:00:00Z',
      expirationDate: '2025-12-31T23:59:59Z',
      maxUsage: 100,
      maxUsagePerUser: 1,
      status: 'active',
      createdBy: { _id: 'seller1', email: 'seller@test.com' },
    };

    // Mock POST /coupons to return the created coupon
    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: newCoupon,
      },
    });

    const wrapper = ({ children }) => (
      <BrowserRouter>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Provider>
      </BrowserRouter>
    );

    render(<CouponCreate />, { wrapper });

    // Wait for the form to be ready
    await waitFor(() => {
      expect(screen.getByPlaceholderText('CODEPROMO')).toBeInTheDocument();
    });

    // Fill in the required coupon form fields
    const codeInput = screen.getByPlaceholderText('CODEPROMO');
    await user.clear(codeInput);
    await user.type(codeInput, 'SUMMER2025');

    // Fill required expiration date using querySelector (simpler for datetime-local inputs)
    const form = screen.getByRole('button', { name: /Créer le coupon/i }).closest('form');
    const expirationInput = form.querySelector('input[name="expirationDate"]');
    await user.type(expirationInput, '2025-12-31T23:59');

    // Submit the form (other fields have default values from useForm)
    const submitButton = screen.getByRole('button', { name: /Créer le coupon/i });
    await user.click(submitButton);

    // Verify API was called with correct data
    await waitFor(
      () => {
        expect(mockAxios.post).toHaveBeenCalledWith(
          '/coupons',
          expect.objectContaining({
            code: 'SUMMER2025',
          })
        );
      },
      { timeout: 3000 }
    );

    // Verify the POST was called exactly once
    expect(mockAxios.post).toHaveBeenCalledTimes(1);

    // Verify React Query cache was updated with the new coupon
    await waitFor(() => {
      const cacheData = queryClient.getQueryData(['seller', 'coupons', 1]);
      expect(cacheData).toBeDefined();
      expect(cacheData.list).toHaveLength(1);
      expect(cacheData.list[0]._id).toBe('coupon123');
      expect(cacheData.list[0].code).toBe('SUMMER2025');
      expect(cacheData.list[0].value).toBe(20);
    });

    // Verify navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/seller/coupons');
  });
});
