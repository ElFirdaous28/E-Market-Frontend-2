import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../../store/userSlice';
import ProductsManager from '../../../pages/seller/ProductsManager';
import mockAxios from '../../../services/axios';

// Mock axios
jest.mock('../../../services/axios');

describe('FilterPaginateProducts - Integration Test', () => {
  let store;
  let queryClient;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Redux store with seller user
    store = configureStore({
      reducer: {
        user: userReducer,
      },
      preloadedState: {
        user: {
          user: {
            id: 'seller1',
            name: 'Test Seller',
            email: 'seller@test.com',
            role: 'seller',
          },
        },
      },
    });

    // Setup React Query client
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  test('Given 50 produits, When filtre/pagination, Then affichage correct', async () => {
    // Create 50 mock products
    // First 10: iPhone 1-10
    // Remaining 40: Product 11-50
    const mockProducts = Array.from({ length: 50 }, (_, i) => ({
      _id: `prod${i + 1}`,
      id: `prod${i + 1}`,
      title: i < 10 ? `iPhone ${i + 1}` : `Product ${i + 1}`,
      description: `Description ${i + 1}`,
      price: 100 + i * 10,
      stock: 10 + i,
      seller_id: 'seller1',
      published: true,
      primaryImage: null,
    }));

    // Mock API responses
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
          <BrowserRouter>{children}</BrowserRouter>
        </QueryClientProvider>
      </Provider>
    );

    render(<ProductsManager />, { wrapper });

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText(/Affichage de/)).toBeInTheDocument();
    });

    // ✅ Test 1: Default pagination shows first 10 products
    expect(screen.getByText('iPhone 1')).toBeInTheDocument();
    expect(screen.getByText('iPhone 9')).toBeInTheDocument();
    expect(screen.queryByText('Product 11')).not.toBeInTheDocument(); // Page 2 product
    expect(screen.getByText('Affichage de 1 à 10 sur 50 produits')).toBeInTheDocument();

    // ✅ Test 2: Filter by search term "iPhone"
    const searchInput = screen.getByPlaceholderText('Rechercher par titre...');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'iPhone');

    await waitFor(() => {
      expect(screen.getByText('Affichage de 1 à 10 sur 10 produits')).toBeInTheDocument();
    });

    // Should show only iPhone products (10 total)
    expect(screen.getByText('iPhone 1')).toBeInTheDocument();
    expect(screen.getByText('iPhone 5')).toBeInTheDocument();
    expect(screen.queryByText('Product 15')).not.toBeInTheDocument(); // Non-iPhone product

    // ✅ Test 3: Clear filter to show all products again
    await userEvent.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText('Affichage de 1 à 10 sur 50 produits')).toBeInTheDocument();
    });

    // ✅ Test 4: Change page size to 20
    const pageSizeSelect = screen.getByRole('combobox');
    await userEvent.selectOptions(pageSizeSelect, '20');

    await waitFor(() => {
      expect(screen.getByText('Affichage de 1 à 20 sur 50 produits')).toBeInTheDocument();
    });

    // Should now show first 20 products
    expect(screen.getByText('iPhone 1')).toBeInTheDocument();
    expect(screen.getByText('Product 19')).toBeInTheDocument();
    expect(screen.queryByText('Product 21')).not.toBeInTheDocument(); // Page 2 product

    // ✅ Test 5: Navigate to page 2
    const nextButton = screen.getByRole('button', { name: /suivant/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Affichage de 21 à 40 sur 50 produits')).toBeInTheDocument();
    });

    // Should show products 21-40
    expect(screen.getByText('Product 21')).toBeInTheDocument();
    expect(screen.getByText('Product 40')).toBeInTheDocument();
    expect(screen.queryByText('Product 19')).not.toBeInTheDocument(); // Page 1 product

    // ✅ Test 6: Navigate to page 3 (last page)
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Affichage de 41 à 50 sur 50 produits')).toBeInTheDocument();
    });

    // Should show last 10 products (41-50)
    expect(screen.getByText('Product 41')).toBeInTheDocument();
    expect(screen.getByText('Product 50')).toBeInTheDocument();

    // ✅ Test 7: Previous button should work
    const prevButton = screen.getByRole('button', { name: /précédent/i });
    await userEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText('Affichage de 21 à 40 sur 50 produits')).toBeInTheDocument();
    });

    // Back to page 2
    expect(screen.getByText('Product 21')).toBeInTheDocument();

    // ✅ Test 8: Filter with pagination - search "Product" and paginate
    // First, reset page size back to 10 to make test predictable
    await userEvent.selectOptions(pageSizeSelect, '10');

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Product');

    await waitFor(() => {
      // 40 products match "Product" (Product 11-50, excludes 10 iPhones)
      // With pageSize=10, shows first 10 matching products (Product 11-20)
      expect(screen.getByText('Affichage de 1 à 10 sur 40 produits')).toBeInTheDocument();
    });

    // Should show first 10 "Product X" items (Product 11 to Product 20)
    expect(screen.getByText('Product 11')).toBeInTheDocument();
    expect(screen.getByText('Product 20')).toBeInTheDocument();
    expect(screen.queryByText('iPhone 1')).not.toBeInTheDocument(); // Filtered out
    expect(screen.queryByText('Product 21')).not.toBeInTheDocument(); // Page 2
  });
});
