import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCart } from "../../hooks/useCart";
import { useAxios } from "../../hooks/useAxios"; // We mock the hook, not the service
import { useAuth } from "../../hooks/useAuth";
import cartReducer from "../../store/cartSlice";
import userReducer from "../../store/userSlice";

// 1. Mock Custom Hooks
jest.mock("../../services/axios");
jest.mock("../../hooks/useAxios");
jest.mock("../../hooks/useAuth");

describe("useCart Hook Unit Tests", () => {
    let mockGet;

    // Helper to wrap the hook with Providers (Redux + React Query)
    const createWrapper = () => {
        const store = configureStore({
            reducer: {
                cart: cartReducer,
                user: userReducer,
            },
        });

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
            logger: { log: console.log, warn: console.warn, error: () => { } },
        });

        return ({ children }) => (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock Auth (User is logged in)
        useAuth.mockReturnValue({ user: { _id: "user123" } });

        // Mock Axios (Spy on the 'get' method)
        mockGet = jest.fn();
        useAxios.mockReturnValue({
            get: mockGet,
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        });
    });

    it("Given a cart with 2 products (via API), When useCart() is called, Then it returns the list of products and the total quantity", async () => {
        // 1. SETUP: Mock API returning 2 items
        const mockItems = [
            {
                _id: "1",
                productId: { title: "Product A", price: 10 },
                quantity: 2
            },
            {
                _id: "2",
                productId: { title: "Product B", price: 20 },
                quantity: 3
            }
        ];

        // The hook calls axios.get("/cart")
        mockGet.mockResolvedValue({
            data: {
                data: { items: mockItems }
            }
        });

        // 2. ACT: Render the hook
        const { result } = renderHook(() => useCart(), {
            wrapper: createWrapper(),
        });

        // 3. WAIT: For isLoading to become false (React Query fetch)
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // 4. ASSERT: Verify Return Values
        expect(result.current.cart.items).toHaveLength(2);
        expect(result.current.cart.items[0].productId.title).toBe("Product A");

        // Check calculated total quantity (2 + 3 = 5)
        expect(result.current.cartLength).toBe(5);
    });
});